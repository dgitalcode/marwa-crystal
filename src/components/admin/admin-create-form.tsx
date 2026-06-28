"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";

import { createAdmin } from "@/actions/admin-users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export function AdminCreateForm({ allowSuperAdminRole = false }: { allowSuperAdminRole?: boolean }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      className="grid gap-4"
      action={(formData) => {
        startTransition(async () => {
          const result = await createAdmin(formData);
          if (result.success) {
            formRef.current?.reset();
            toast.success(result.message ?? "Compte cree.");
            return;
          }
          toast.error(result.error);
        });
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="name">Nom</Label>
        <Input id="name" name="name" required minLength={2} disabled={isPending} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="off"
          disabled={isPending}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          disabled={isPending}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="role">Role</Label>
        <Select id="role" name="role" defaultValue="ADMIN" disabled={isPending}>
          <option value="ADMIN">Administrateur</option>
          {allowSuperAdminRole ? (
            <option value="SUPER_ADMIN">Super administrateur</option>
          ) : null}
        </Select>
      </div>
      <Button type="submit" variant="accent" disabled={isPending}>
        {isPending ? "Creation..." : "Creer le compte"}
      </Button>
    </form>
  );
}
