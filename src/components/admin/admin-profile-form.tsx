"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { updateAdminProfile } from "@/actions/admin-users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AdminProfile } from "@/lib/admin-users";

export function AdminProfileForm({ profile }: { profile: AdminProfile }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="grid gap-5"
      action={(formData) => {
        startTransition(async () => {
          const result = await updateAdminProfile(formData);
          if (result.success) {
            toast.success(result.message);
            router.refresh();
            return;
          }
          toast.error(result.error);
        });
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="name">Nom</Label>
        <Input
          id="name"
          name="name"
          defaultValue={profile.name ?? ""}
          required
          minLength={2}
          disabled={isPending}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={profile.email}
          required
          disabled={isPending}
        />
      </div>

      <div className="rounded-2xl border border-border bg-muted/20 p-4">
        <p className="text-sm font-black">Changer le mot de passe</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Laissez vide si vous ne souhaitez pas modifier le mot de passe.
        </p>
        <div className="mt-4 grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="currentPassword">Mot de passe actuel</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              disabled={isPending}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              minLength={8}
              autoComplete="new-password"
              disabled={isPending}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              minLength={8}
              autoComplete="new-password"
              disabled={isPending}
            />
          </div>
        </div>
      </div>

      <Button type="submit" variant="accent" disabled={isPending}>
        {isPending ? "Enregistrement..." : "Enregistrer les modifications"}
      </Button>
    </form>
  );
}
