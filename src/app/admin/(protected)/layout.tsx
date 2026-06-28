import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/auth";
import { AdminLayoutShell } from "@/components/admin/admin-layout-shell";
import { isAdminRole } from "@/lib/admin-auth";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!isAdminRole(session?.user?.role)) {
    redirect("/admin/login");
  }

  return <AdminLayoutShell role={session.user.role}>{children}</AdminLayoutShell>;
}
