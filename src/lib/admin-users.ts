import { prisma } from "@/lib/prisma";
import type { Role } from "@/generated/prisma";

export type AdminProfile = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
};

function mapAdmin(user: {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}): AdminProfile {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

const adminSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function getAdminProfileByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: adminSelect,
  });

  return user ? mapAdmin(user) : null;
}

export async function getAdminProfileById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: adminSelect,
  });

  return user ? mapAdmin(user) : null;
}

export async function getAllAdmins() {
  const users = await prisma.user.findMany({
    where: {
      role: { in: ["ADMIN", "SUPER_ADMIN"] },
    },
    orderBy: [{ createdAt: "desc" }],
    select: adminSelect,
  });

  return users.map(mapAdmin);
}
