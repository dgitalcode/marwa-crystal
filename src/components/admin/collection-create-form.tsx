"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { createCollection } from "@/actions/admin-collections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CollectionCreateForm() {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const result = await createCollection(formData);
          if (result.success) {
            toast.success("Collection creee.");
            return;
          }

          toast.error(result.error);
        });
      }}
      className="grid gap-4"
    >
      <div className="grid gap-2">
        <Label htmlFor="name">Nom</Label>
        <Input id="name" name="name" required minLength={2} disabled={isPending} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="slug">Slug (optionnel)</Label>
        <Input
          id="slug"
          name="slug"
          placeholder="auto-genere depuis le nom"
          disabled={isPending}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          minLength={3}
          rows={3}
          placeholder="Ex: Pieces en cristal pour sublimer votre table."
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">Minimum 3 caracteres.</p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="heroImageUrl">Image (URL Cloudinary ou chemin local)</Label>
        <Input
          id="heroImageUrl"
          name="heroImageUrl"
          placeholder="/images/collections/..."
          disabled={isPending}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="position">Position dans le header</Label>
        <Input
          id="position"
          name="position"
          type="number"
          min={0}
          placeholder="Auto (fin de liste)"
          disabled={isPending}
        />
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input
          name="isVisible"
          type="checkbox"
          value="true"
          defaultChecked
          disabled={isPending}
        />
        Visible dans le header
      </label>
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input name="isFeatured" type="checkbox" value="true" disabled={isPending} />
        Afficher sur la home
      </label>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Creation..." : "Creer la collection"}
      </Button>
    </form>
  );
}
