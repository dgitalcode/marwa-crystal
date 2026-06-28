import type { Role } from "@/generated/prisma";

export function isAdminRole(role?: Role | string | null) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function isSuperAdmin(role?: Role | string | null) {
  return role === "SUPER_ADMIN";
}

export function getRoleLabel(role: Role) {
  switch (role) {
    case "SUPER_ADMIN":
      return "Super administrateur";
    case "ADMIN":
      return "Administrateur";
    default:
      return role;
  }
}
