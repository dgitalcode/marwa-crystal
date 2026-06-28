"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin-auth";
import { STORE_SETTINGS_ID } from "@/data/default-store-settings";
import {
  deleteLocalLogoFile,
  getDefaultStoreSettingsRecord,
  saveUploadedLogoFile,
} from "@/lib/store-settings";
import { prisma } from "@/lib/prisma";

export type StoreSettingsActionResult =
  | { success: true }
  | { success: false; error: string };

function revalidateStorefront() {
  revalidatePath("/");
  revalidatePath("/collections");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/admin/settings");
}

function emptyToUndefined(value: unknown) {
  return value === "" || value === null || value === undefined ? undefined : value;
}

function validationErrorMessage(error: z.ZodError) {
  const issue = error.issues[0];
  if (!issue) {
    return "Donnees invalides.";
  }

  const field = issue.path[0];
  if (typeof field === "string") {
    return `${field}: ${issue.message}`;
  }

  return issue.message;
}

function parseCheckbox(formData: FormData, name: string) {
  return formData.get(name) === "true";
}

function normalizeSocialUrl(value: string) {
  const trimmed = value.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function normalizeWhatsAppUrl(value: string) {
  const trimmed = value.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length > 0) {
    return `https://wa.me/${digits}`;
  }

  return trimmed;
}

const logoSchema = z.object({
  logoType: z.enum(["TEXT", "IMAGE"]),
  logoText: z.string().min(1, "Le texte du logo est requis."),
  logoColor: z.string().min(1),
  logoSize: z.string().min(1),
  logoFontWeight: z.string().min(1),
  logoWidth: z.coerce.number().int().min(40).max(600),
  logoHeight: z.coerce.number().int().min(20).max(300),
  footerLogoWidth: z.coerce.number().int().min(40).max(600),
  footerLogoHeight: z.coerce.number().int().min(20).max(300),
});

const footerSchema = z.object({
  footerDescription: z.string().min(3),
  facebookUrl: z.string().min(3),
  instagramUrl: z.string().min(3),
  tiktokUrl: z.string().min(3),
  whatsappUrl: z.string().min(3),
  contactPhone: z.string().min(3),
  contactAddress: z.string().min(3),
  contactHours: z.string().min(3),
  contactEmail: z.preprocess(emptyToUndefined, z.string().optional()),
  copyrightText: z.string().min(3),
});

const announcementSchema = z.object({
  announcementText: z.string().min(3),
  announcementEnabled: z.coerce.boolean().optional(),
  announcementBackgroundColor: z.string().min(1),
  announcementTextColor: z.string().min(1),
});

export async function updateLogoSettings(formData: FormData): Promise<StoreSettingsActionResult> {
  await requireAdmin();

  const parsed = logoSchema.safeParse({
    logoType: formData.get("logoType"),
    logoText: formData.get("logoText"),
    logoColor: formData.get("logoColor"),
    logoSize: formData.get("logoSize"),
    logoFontWeight: formData.get("logoFontWeight"),
    logoWidth: formData.get("logoWidth"),
    logoHeight: formData.get("logoHeight"),
    footerLogoWidth: formData.get("footerLogoWidth"),
    footerLogoHeight: formData.get("footerLogoHeight"),
  });

  if (!parsed.success) {
    return { success: false, error: validationErrorMessage(parsed.error) };
  }

  try {
    const current = await prisma.storeSettings.findUnique({
      where: { id: STORE_SETTINGS_ID },
    });

    let logoImageUrl = current?.logoImageUrl ?? null;
    let logoType = parsed.data.logoType;

    if (parseCheckbox(formData, "removeLogo")) {
      await deleteLocalLogoFile(logoImageUrl);
      logoImageUrl = null;
      logoType = "TEXT";
    } else {
      const logoFile = formData.get("logoFile");
      if (logoFile instanceof File && logoFile.size > 0) {
        await deleteLocalLogoFile(logoImageUrl);
        logoImageUrl = await saveUploadedLogoFile(logoFile);
        logoType = "IMAGE";
      }
    }

    if (logoType === "IMAGE" && !logoImageUrl) {
      return {
        success: false,
        error: "Uploadez une image de logo ou passez en mode texte.",
      };
    }

    await prisma.storeSettings.upsert({
      where: { id: STORE_SETTINGS_ID },
      update: {
        ...parsed.data,
        logoType,
        logoImageUrl,
      },
      create: {
        ...getDefaultStoreSettingsRecord(),
        ...parsed.data,
        logoType,
        logoImageUrl,
      },
    });

    revalidateStorefront();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Impossible de mettre a jour le logo.",
    };
  }
}

export async function removeStoreLogo(): Promise<StoreSettingsActionResult> {
  await requireAdmin();

  try {
    const current = await prisma.storeSettings.findUnique({
      where: { id: STORE_SETTINGS_ID },
    });

    await deleteLocalLogoFile(current?.logoImageUrl);

    await prisma.storeSettings.upsert({
      where: { id: STORE_SETTINGS_ID },
      update: {
        logoImageUrl: null,
        logoType: "TEXT",
      },
      create: {
        ...getDefaultStoreSettingsRecord(),
        logoImageUrl: null,
        logoType: "TEXT",
      },
    });

    revalidateStorefront();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Impossible de supprimer le logo.",
    };
  }
}

export async function updateFooterSettings(
  formData: FormData,
): Promise<StoreSettingsActionResult> {
  await requireAdmin();

  const parsed = footerSchema.safeParse({
    footerDescription: formData.get("footerDescription"),
    facebookUrl: formData.get("facebookUrl"),
    instagramUrl: formData.get("instagramUrl"),
    tiktokUrl: formData.get("tiktokUrl"),
    whatsappUrl: formData.get("whatsappUrl"),
    contactPhone: formData.get("contactPhone"),
    contactAddress: formData.get("contactAddress"),
    contactHours: formData.get("contactHours"),
    contactEmail: formData.get("contactEmail"),
    copyrightText: formData.get("copyrightText"),
  });

  if (!parsed.success) {
    return { success: false, error: validationErrorMessage(parsed.error) };
  }

  const socialUrls = {
    facebook: normalizeSocialUrl(parsed.data.facebookUrl),
    instagram: normalizeSocialUrl(parsed.data.instagramUrl),
    tiktok: normalizeSocialUrl(parsed.data.tiktokUrl),
    whatsapp: normalizeWhatsAppUrl(parsed.data.whatsappUrl),
  };

  try {
    await prisma.storeSettings.upsert({
      where: { id: STORE_SETTINGS_ID },
      update: {
        footerDescription: parsed.data.footerDescription,
        socialUrls,
        contactInfo: {
          phone: parsed.data.contactPhone,
          address: parsed.data.contactAddress,
          hours: parsed.data.contactHours,
          email: parsed.data.contactEmail,
        },
        copyrightText: parsed.data.copyrightText,
      },
      create: {
        ...getDefaultStoreSettingsRecord(),
        footerDescription: parsed.data.footerDescription,
        socialUrls,
        contactInfo: {
          phone: parsed.data.contactPhone,
          address: parsed.data.contactAddress,
          hours: parsed.data.contactHours,
          email: parsed.data.contactEmail,
        },
        copyrightText: parsed.data.copyrightText,
      },
    });

    revalidateStorefront();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Impossible de mettre a jour le footer.",
    };
  }
}

export async function updateAnnouncementSettings(
  formData: FormData,
): Promise<StoreSettingsActionResult> {
  await requireAdmin();

  const parsed = announcementSchema.safeParse({
    announcementText: formData.get("announcementText"),
    announcementEnabled: parseCheckbox(formData, "announcementEnabled"),
    announcementBackgroundColor: formData.get("announcementBackgroundColor"),
    announcementTextColor: formData.get("announcementTextColor"),
  });

  if (!parsed.success) {
    return { success: false, error: validationErrorMessage(parsed.error) };
  }

  try {
    await prisma.storeSettings.upsert({
      where: { id: STORE_SETTINGS_ID },
      update: {
        announcementText: parsed.data.announcementText,
        announcementEnabled: parseCheckbox(formData, "announcementEnabled"),
        announcementStyle: {
          backgroundColor: parsed.data.announcementBackgroundColor,
          textColor: parsed.data.announcementTextColor,
        },
      },
      create: {
        ...getDefaultStoreSettingsRecord(),
        announcementText: parsed.data.announcementText,
        announcementEnabled: parseCheckbox(formData, "announcementEnabled"),
        announcementStyle: {
          backgroundColor: parsed.data.announcementBackgroundColor,
          textColor: parsed.data.announcementTextColor,
        },
      },
    });

    revalidateStorefront();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Impossible de mettre a jour la banniere.",
    };
  }
}
