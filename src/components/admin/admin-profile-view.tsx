import { CalendarDays, Shield } from "lucide-react";

import { AdminProfileForm } from "@/components/admin/admin-profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRoleLabel } from "@/lib/admin-auth";
import type { AdminProfile } from "@/lib/admin-users";

function formatDate(value: string) {
  return new Date(value).toLocaleString("fr-MA", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

export function AdminProfileView({ profile }: { profile: AdminProfile }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Modifier mon profil</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminProfileForm profile={profile} />
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4 text-accent" />
              Compte & acces
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Role</p>
              <p className="mt-1 font-semibold">{getRoleLabel(profile.role)}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                ID du compte
              </p>
              <p className="mt-1 break-all font-mono text-xs text-muted-foreground">{profile.id}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="h-4 w-4 text-accent" />
              Historique
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Cree le
              </p>
              <p className="mt-1 font-semibold">{formatDate(profile.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Derniere mise a jour
              </p>
              <p className="mt-1 font-semibold">{formatDate(profile.updatedAt)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
