import { redirect } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminProfileView } from "@/components/admin/admin-profile-view";
import { getAdminSession } from "@/lib/admin-auth";
import { getAdminProfileByEmail, getAdminProfileById } from "@/lib/admin-users";

export default async function AdminProfilePage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const profile =
    (session.user.id ? await getAdminProfileById(session.user.id) : null) ??
    (session.user.email ? await getAdminProfileByEmail(session.user.email) : null);

  if (!profile) {
    redirect("/admin/login");
  }

  return (
    <div className="grid gap-8">
      <AdminPageHeader
        eyebrow="Profil"
        title="Mon compte administrateur"
        description="Modifiez vos informations personnelles, email et mot de passe."
      />
      <AdminProfileView profile={profile} />
    </div>
  );
}
