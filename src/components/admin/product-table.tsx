"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { deleteProduct, updateProduct, updateProductStock } from "@/actions/admin-catalog";
import { ProductStatusBadge } from "@/components/admin/admin-status-badge";
import { StoreImage } from "@/components/store/store-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatMoney } from "@/lib/utils";
import type { ProductStatus } from "@/generated/prisma";

export type AdminProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  badge: string | null;
  status: ProductStatus;
  collectionName: string;
  imageUrl: string | null;
};

export function ProductTable({ products }: { products: AdminProductRow[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[920px] text-left text-sm">
        <thead className="bg-muted/50">
          <tr className="text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3">Produit</th>
            <th className="px-4 py-3">Collection</th>
            <th className="px-4 py-3">Prix</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Statut</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductTableRow key={product.id} product={product} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductTableRow({ product }: { product: AdminProductRow }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <tr className="border-t border-border align-top">
        <td className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
              {product.imageUrl ? (
                <StoreImage
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              ) : null}
            </div>
            <div className="min-w-0">
              <p className="font-black">{product.name}</p>
              {product.badge ? (
                <p className="text-xs font-bold text-accent">{product.badge}</p>
              ) : null}
            </div>
          </div>
        </td>
        <td className="px-4 py-4 text-muted-foreground">{product.collectionName}</td>
        <td className="px-4 py-4 font-semibold">
          {formatMoney(product.discountPrice ?? product.price)}
        </td>
        <td className="px-4 py-4">
          <form
            className="flex items-center gap-2"
            action={(formData) => {
              startTransition(async () => {
                await updateProductStock(product.id, formData);
                router.refresh();
                toast.success("Stock mis a jour.");
              });
            }}
          >
            <Input
              name="stock"
              type="number"
              defaultValue={product.stock}
              className="h-9 w-20"
              disabled={isPending}
            />
            <Button type="submit" size="sm" variant="outline" disabled={isPending}>
              OK
            </Button>
          </form>
        </td>
        <td className="px-4 py-4">
          <ProductStatusBadge status={product.status} />
        </td>
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
              disabled={isPending}
              onClick={() => {
                if (!window.confirm(`Supprimer ou archiver "${product.name}" ?`)) {
                  return;
                }
                startTransition(async () => {
                  const result = await deleteProduct(product.id);
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
      </tr>
      {editing ? (
        <tr className="border-t border-border bg-muted/20">
          <td colSpan={6} className="px-4 py-4">
            <form
              className="grid gap-3 md:grid-cols-2"
              action={(formData) => {
                startTransition(async () => {
                  const result = await updateProduct(product.id, formData);
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
              <Input name="name" defaultValue={product.name} required disabled={isPending} />
              <Select name="status" defaultValue={product.status} disabled={isPending}>
                <option value="ACTIVE">Actif</option>
                <option value="DRAFT">Brouillon</option>
                <option value="ARCHIVED">Archive</option>
              </Select>
              <Textarea
                name="description"
                defaultValue={product.description}
                rows={3}
                className="md:col-span-2"
                required
                disabled={isPending}
              />
              <Input
                name="price"
                type="number"
                defaultValue={product.price}
                required
                disabled={isPending}
              />
              <Input
                name="discountPrice"
                type="number"
                defaultValue={product.discountPrice ?? ""}
                disabled={isPending}
              />
              <Input name="stock" type="number" defaultValue={product.stock} required disabled={isPending} />
              <Input name="badge" defaultValue={product.badge ?? ""} disabled={isPending} />
              <div className="flex gap-2 md:col-span-2">
                <Button type="submit" variant="accent" disabled={isPending}>
                  Enregistrer
                </Button>
                <Button type="button" variant="outline" disabled={isPending} onClick={() => setEditing(false)}>
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
