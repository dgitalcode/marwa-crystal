"use client";

import { useTransition } from "react";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  deleteCollection,
  toggleCollectionVisibility,
  updateCollection,
} from "@/actions/admin-collections";
import { StoreImage } from "@/components/store/store-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CollectionNavItem } from "@/types/navigation";

type CollectionNavManagerProps = {
  collections: CollectionNavItem[];
};

export function CollectionNavManager({ collections }: CollectionNavManagerProps) {
  return (
    <div className="grid gap-4">
      {collections.map((collection) => (
        <CollectionNavItemCard key={collection.id} collection={collection} />
      ))}
      {collections.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aucune collection en base. Creez la premiere pour l&apos;afficher dans le header.
        </p>
      ) : null}
    </div>
  );
}

function CollectionNavItemCard({ collection }: { collection: CollectionNavItem }) {
  const [isPending, startTransition] = useTransition();

  function handleToggleVisibility() {
    startTransition(async () => {
      try {
        await toggleCollectionVisibility(collection.id);
        toast.success(
          collection.isVisible
            ? "Collection masquee du header"
            : "Collection visible dans le header",
        );
      } catch {
        toast.error("Impossible de modifier la visibilite.");
      }
    });
  }

  function handleDelete() {
    if (
      !window.confirm(
        `Supprimer la collection « ${collection.name} » ? Cette action est irreversible.`,
      )
    ) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteCollection(collection.id);
        toast.success("Collection supprimee.");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Impossible de supprimer la collection.",
        );
      }
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-muted">
            {collection.image ? (
              <StoreImage
                src={collection.image}
                alt={collection.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">
                Sans image
              </div>
            )}
          </div>
          <div>
            <p className="font-black">{collection.name}</p>
            <p className="text-sm text-muted-foreground">/{collection.slug}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {collection.productCount} produit{collection.productCount > 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={isPending}
            onClick={handleToggleVisibility}
            aria-label={collection.isVisible ? "Masquer du header" : "Afficher dans le header"}
            title={collection.isVisible ? "Masquer du header" : "Afficher dans le header"}
          >
            {collection.isVisible ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={isPending || collection.productCount > 0}
            onClick={handleDelete}
            aria-label="Supprimer la collection"
            title={
              collection.productCount > 0
                ? "Supprimez d'abord les produits de cette collection"
                : "Supprimer la collection"
            }
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <form
        action={(formData) => {
          startTransition(async () => {
            const result = await updateCollection(formData);
            if (result.success) {
              toast.success("Collection mise a jour.");
              return;
            }

            toast.error(result.error);
          });
        }}
        className="grid gap-3 border-t border-border pt-4"
      >
        <input type="hidden" name="id" value={collection.id} />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor={`name-${collection.id}`}>Nom</Label>
            <Input
              id={`name-${collection.id}`}
              name="name"
              defaultValue={collection.name}
              required
              disabled={isPending}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`slug-${collection.id}`}>Slug</Label>
            <Input
              id={`slug-${collection.id}`}
              name="slug"
              defaultValue={collection.slug}
              required
              disabled={isPending}
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`description-${collection.id}`}>Description</Label>
          <Textarea
            id={`description-${collection.id}`}
            name="description"
            defaultValue={collection.description}
            required
            disabled={isPending}
            rows={2}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
          <div className="grid gap-2">
            <Label htmlFor={`heroImageUrl-${collection.id}`}>Image (URL ou chemin local)</Label>
            <Input
              id={`heroImageUrl-${collection.id}`}
              name="heroImageUrl"
              defaultValue={collection.image ?? ""}
              disabled={isPending}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`position-${collection.id}`}>Position</Label>
            <Input
              id={`position-${collection.id}`}
              name="position"
              type="number"
              min={0}
              defaultValue={collection.position}
              required
              disabled={isPending}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              name="isVisible"
              type="checkbox"
              value="true"
              defaultChecked={collection.isVisible}
              disabled={isPending}
            />
            Visible dans le header
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              name="isFeatured"
              type="checkbox"
              value="true"
              defaultChecked={collection.isFeatured}
              disabled={isPending}
            />
            Afficher sur la home
          </label>
          <Button type="submit" size="sm" disabled={isPending}>
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  );
}
