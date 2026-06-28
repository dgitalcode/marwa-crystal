import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { isAdminRole, isSuperAdmin } from "@/lib/admin-roles";

export { getRoleLabel, isAdminRole, isSuperAdmin } from "@/lib/admin-roles";

export async function getAdminSession() {
  const session = await getServerSession(authOptions);
  if (!isAdminRole(session?.user?.role)) {
    return null;
  }
  return session;
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireSuperAdmin() {
  const session = await requireAdmin();
  if (!isSuperAdmin(session.user.role)) {
    throw new Error("Unauthorized");
  }
  return session;
}
