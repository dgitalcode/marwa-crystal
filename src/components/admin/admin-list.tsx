import { getRoleLabel } from "@/lib/admin-auth";
import type { AdminProfile } from "@/lib/admin-users";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("fr-MA", { dateStyle: "medium" });
}

export function AdminList({ admins }: { admins: AdminProfile[] }) {
  if (admins.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucun administrateur trouve.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className="px-4 py-3 font-bold uppercase tracking-wide text-muted-foreground">
              Nom
            </th>
            <th className="px-4 py-3 font-bold uppercase tracking-wide text-muted-foreground">
              Email
            </th>
            <th className="px-4 py-3 font-bold uppercase tracking-wide text-muted-foreground">
              Role
            </th>
            <th className="px-4 py-3 font-bold uppercase tracking-wide text-muted-foreground">
              Cree le
            </th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3 font-semibold">{admin.name ?? "—"}</td>
              <td className="px-4 py-3">{admin.email}</td>
              <td className="px-4 py-3">{getRoleLabel(admin.role)}</td>
              <td className="px-4 py-3 text-muted-foreground">{formatDate(admin.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
