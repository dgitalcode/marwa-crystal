"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { deleteAdminAccount, updateAdminAccount } from "@/actions/admin-users";
import { getRoleLabel } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { AdminProfile } from "@/lib/admin-users";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("fr-MA", { dateStyle: "medium" });
}

export function AdminListManager({
  admins,
  currentUserId,
  canManage,
}: {
  admins: AdminProfile[];
  currentUserId?: string;
  canManage: boolean;
}) {
  if (admins.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucun administrateur trouve.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[760px] text-left text-sm">
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
            {canManage ? (
              <th className="px-4 py-3 font-bold uppercase tracking-wide text-muted-foreground">
                Actions
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <AdminListRow
              key={admin.id}
              admin={admin}
              currentUserId={currentUserId}
              canManage={canManage}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminListRow({
  admin,
  currentUserId,
  canManage,
}: {
  admin: AdminProfile;
  currentUserId?: string;
  canManage: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isSelf = currentUserId === admin.id;

  return (
    <>
      <tr className="border-b border-border align-top">
        <td className="px-4 py-4 font-semibold">
          {admin.name ?? "—"}
          {isSelf ? (
            <span className="ml-2 text-xs font-bold text-accent">(Vous)</span>
          ) : null}
        </td>
        <td className="px-4 py-4">{admin.email}</td>
        <td className="px-4 py-4">{getRoleLabel(admin.role)}</td>
        <td className="px-4 py-4 text-muted-foreground">{formatDate(admin.createdAt)}</td>
        {canManage ? (
          <td className="px-4 py-4">
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() => setEditing((value) => !value)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isPending || isSelf}
                onClick={() => {
                  if (
                    !window.confirm(
                      `Supprimer le compte de ${admin.name ?? admin.email} ?`,
                    )
                  ) {
                    return;
                  }
                  startTransition(async () => {
                    const result = await deleteAdminAccount(admin.id);
                    if (result.success) {
                      toast.success(result.message);
                      router.refresh();
                      return;
                    }
                    toast.error(result.error);
                  });
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </td>
        ) : null}
      </tr>
      {canManage && editing ? (
        <tr className="border-b border-border bg-muted/20">
          <td colSpan={5} className="px-4 py-4">
            <form
              className="grid gap-3 md:grid-cols-2"
              action={(formData) => {
                startTransition(async () => {
                  const result = await updateAdminAccount(admin.id, formData);
                  if (result.success) {
                    toast.success(result.message);
                    setEditing(false);
                    router.refresh();
                    return;
                  }
                  toast.error(result.error);
                });
              }}
            >
              <Input name="name" defaultValue={admin.name ?? ""} required disabled={isPending} />
              <Input
                name="email"
                type="email"
                defaultValue={admin.email}
                required
                disabled={isPending}
              />
              <Select name="role" defaultValue={admin.role} disabled={isPending || isSelf}>
                <option value="ADMIN">Administrateur</option>
                <option value="SUPER_ADMIN">Super administrateur</option>
              </Select>
              <Input
                name="password"
                type="password"
                placeholder="Nouveau mot de passe (optionnel)"
                minLength={8}
                autoComplete="new-password"
                disabled={isPending}
              />
              <div className="flex gap-2 md:col-span-2">
                <Button type="submit" variant="accent" disabled={isPending}>
                  Enregistrer
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => setEditing(false)}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </td>
        </tr>
      ) : null}
    </>
  );
}
