"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { requireAdmin, requireSuperAdmin } from "@/lib/admin-auth";
import { isAdminRole, isSuperAdmin } from "@/lib/admin-roles";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/generated/prisma";

export type AdminUserActionResult =
  | { success: true; message?: string }
  | { success: false; error: string };

const createAdminSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caracteres."),
  email: z.string().trim().email("Adresse email invalide."),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caracteres.")
    .max(128, "Le mot de passe est trop long."),
  role: z.enum(["ADMIN", "SUPER_ADMIN"]),
});

const optionalPassword = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? undefined : value),
  z.string().min(8).optional(),
);

const updateProfileSchema = z
  .object({
    name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caracteres."),
    email: z.string().trim().email("Adresse email invalide."),
    currentPassword: z.preprocess(
      (value) => (value === "" || value === null || value === undefined ? undefined : value),
      z.string().optional(),
    ),
    newPassword: optionalPassword,
    confirmPassword: z.preprocess(
      (value) => (value === "" || value === null || value === undefined ? undefined : value),
      z.string().optional(),
    ),
  })
  .superRefine((data, ctx) => {
    const wantsPasswordChange = Boolean(data.newPassword);
    if (!wantsPasswordChange) {
      return;
    }
    if (!data.currentPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Indiquez votre mot de passe actuel.",
        path: ["currentPassword"],
      });
    }
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Les mots de passe ne correspondent pas.",
        path: ["confirmPassword"],
      });
    }
  });

const updateAdminAccountSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caracteres."),
  email: z.string().trim().email("Adresse email invalide."),
  role: z.enum(["ADMIN", "SUPER_ADMIN"]),
  password: optionalPassword,
});

function validationErrorMessage(error: z.ZodError) {
  return error.issues[0]?.message ?? "Donnees invalides.";
}

function revalidateAdminPaths() {
  revalidatePath("/admin/admins");
  revalidatePath("/admin/profile");
}

export async function updateAdminProfile(formData: FormData): Promise<AdminUserActionResult> {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return { success: false, error: "Acces non autorise." };
  }

  const userId = session.user.id;
  if (!userId) {
    return { success: false, error: "Session invalide." };
  }

  const parsed = updateProfileSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    currentPassword: formData.get("currentPassword") || undefined,
    newPassword: formData.get("newPassword") || undefined,
    confirmPassword: formData.get("confirmPassword") || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: validationErrorMessage(parsed.error) };
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return { success: false, error: "Compte introuvable." };
    }

    const email = parsed.data.email.toLowerCase();
    if (email !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return { success: false, error: "Un compte existe deja avec cet email." };
      }
    }

    if (parsed.data.newPassword) {
      const isValid = await bcrypt.compare(parsed.data.currentPassword ?? "", user.passwordHash);
      if (!isValid) {
        return { success: false, error: "Mot de passe actuel incorrect." };
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: parsed.data.name,
        email,
        ...(parsed.data.newPassword
          ? { passwordHash: await bcrypt.hash(parsed.data.newPassword, 12) }
          : {}),
      },
    });

    revalidateAdminPaths();
    return {
      success: true,
      message: parsed.data.newPassword
        ? "Profil et mot de passe mis a jour."
        : "Profil mis a jour.",
    };
  } catch {
    return { success: false, error: "Impossible de mettre a jour le profil." };
  }
}

export async function createAdmin(formData: FormData): Promise<AdminUserActionResult> {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return { success: false, error: "Acces non autorise." };
  }

  const parsed = createAdminSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { success: false, error: validationErrorMessage(parsed.error) };
  }

  const role: Role = isSuperAdmin(session.user.role)
    ? (parsed.data.role as Role)
    : "ADMIN";

  if (parsed.data.role === "SUPER_ADMIN" && !isSuperAdmin(session.user.role)) {
    return { success: false, error: "Seuls les super administrateurs peuvent creer ce role." };
  }

  const email = parsed.data.email.toLowerCase();

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "Un compte existe deja avec cet email." };
    }

    await prisma.user.create({
      data: {
        name: parsed.data.name,
        email,
        passwordHash: await bcrypt.hash(parsed.data.password, 12),
        role,
      },
    });

    revalidateAdminPaths();
    return { success: true, message: "Compte administrateur cree." };
  } catch {
    return { success: false, error: "Impossible de creer le compte pour le moment." };
  }
}

async function countSuperAdmins(excludeId?: string) {
  return prisma.user.count({
    where: {
      role: "SUPER_ADMIN",
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
  });
}

export async function updateAdminAccount(
  adminId: string,
  formData: FormData,
): Promise<AdminUserActionResult> {
  let session;
  try {
    session = await requireSuperAdmin();
  } catch {
    return { success: false, error: "Acces non autorise." };
  }

  if (!session.user?.id) {
    return { success: false, error: "Session invalide." };
  }

  const parsed = updateAdminAccountSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
    password: formData.get("password") || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: validationErrorMessage(parsed.error) };
  }

  try {
    const target = await prisma.user.findUnique({ where: { id: adminId } });
    if (!target || !isAdminRole(target.role)) {
      return { success: false, error: "Compte introuvable." };
    }

    const email = parsed.data.email.toLowerCase();
    if (email !== target.email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return { success: false, error: "Un compte existe deja avec cet email." };
      }
    }

    if (target.role === "SUPER_ADMIN" && parsed.data.role === "ADMIN") {
      const remaining = await countSuperAdmins(target.id);
      if (remaining === 0) {
        return {
          success: false,
          error: "Impossible de retirer le dernier super administrateur.",
        };
      }
    }

    await prisma.user.update({
      where: { id: adminId },
      data: {
        name: parsed.data.name,
        email,
        role: parsed.data.role as Role,
        ...(parsed.data.password
          ? { passwordHash: await bcrypt.hash(parsed.data.password, 12) }
          : {}),
      },
    });

    revalidateAdminPaths();
    return {
      success: true,
      message: parsed.data.password
        ? "Compte mis a jour avec nouveau mot de passe."
        : "Compte mis a jour.",
    };
  } catch {
    return { success: false, error: "Impossible de mettre a jour le compte." };
  }
}

export async function deleteAdminAccount(adminId: string): Promise<AdminUserActionResult> {
  let session;
  try {
    session = await requireSuperAdmin();
  } catch {
    return { success: false, error: "Acces non autorise." };
  }

  if (session.user.id === adminId) {
    return { success: false, error: "Vous ne pouvez pas supprimer votre propre compte." };
  }

  try {
    const target = await prisma.user.findUnique({ where: { id: adminId } });
    if (!target || !isAdminRole(target.role)) {
      return { success: false, error: "Compte introuvable." };
    }

    if (target.role === "SUPER_ADMIN") {
      const remaining = await countSuperAdmins(target.id);
      if (remaining === 0) {
        return {
          success: false,
          error: "Impossible de supprimer le dernier super administrateur.",
        };
      }
    }

    await prisma.user.delete({ where: { id: adminId } });

    revalidateAdminPaths();
    return { success: true, message: "Compte administrateur supprime." };
  } catch {
    return { success: false, error: "Impossible de supprimer le compte." };
  }
}
