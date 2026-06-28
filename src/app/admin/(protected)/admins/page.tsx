import { AdminCreateForm } from "@/components/admin/admin-create-form";
import { AdminListManager } from "@/components/admin/admin-list-manager";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminSession } from "@/lib/admin-auth";
import { isSuperAdmin } from "@/lib/admin-roles";
import { getAllAdmins } from "@/lib/admin-users";

export default async function AdminManagementPage() {
  const session = await getAdminSession();
  const allowSuperAdminRole = isSuperAdmin(session?.user.role);
  const canManageAdmins = allowSuperAdminRole;
  const admins = await getAllAdmins();

  return (
    <div className="grid gap-8">
      <AdminPageHeader
        eyebrow="Administration"
        title="Gestion des administrateurs"
        description={
          canManageAdmins
            ? "Creez, modifiez ou supprimez les comptes administrateurs. Reserve aux super administrateurs."
            : "Creez de nouveaux comptes avec le role Administrateur."
        }
      />

      <div className="grid gap-6 lg:grid-cols-[360px_1fr] lg:items-start">
        <Card>
          <CardHeader>
            <CardTitle>Nouveau compte</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminCreateForm allowSuperAdminRole={allowSuperAdminRole} />
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <h2 className="text-lg font-black">Comptes existants</h2>
          <AdminListManager
            admins={admins}
            currentUserId={session?.user.id}
            canManage={canManageAdmins}
          />
        </div>
      </div>
    </div>
  );
}
