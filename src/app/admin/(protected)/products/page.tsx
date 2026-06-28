import { PackageSearch } from "lucide-react";
import type { ProductStatus } from "@/generated/prisma";

import { createProduct } from "@/actions/admin-catalog";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminSearchForm } from "@/components/admin/admin-search-form";
import { ProductTable } from "@/components/admin/product-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ADMIN_PAGE_SIZE, getPaginationParams, getTotalPages } from "@/lib/admin-pagination";
import { prisma } from "@/lib/prisma";

type SearchParams = Promise<{ q?: string; status?: string; page?: string }>;

async function getData(searchParams: { q?: string; status?: string; page?: string }) {
  const { page, skip, take } = getPaginationParams(searchParams.page);
  const q = searchParams.q?.trim();
  const status =
    searchParams.status && searchParams.status !== "ALL"
      ? (searchParams.status as ProductStatus)
      : undefined;

  const where = {
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { sku: { contains: q, mode: "insensitive" as const } },
            { collection: { name: { contains: q, mode: "insensitive" as const } } },
          ],
        }
      : {}),
  };

  try {
    const [collections, products, total] = await Promise.all([
      prisma.collection.findMany({ orderBy: { name: "asc" } }),
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
        include: {
          collection: true,
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      collections,
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        discountPrice: product.discountPrice,
        stock: product.stock,
        badge: product.badge,
        status: product.status,
        collectionName: product.collection.name,
        imageUrl: product.images[0]?.url ?? null,
      })),
      total,
      page,
    };
  } catch {
    return { collections: [], products: [], total: 0, page: 1 };
  }
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const { collections, products, total, page } = await getData(params);
  const totalPages = getTotalPages(total);

  return (
    <div className="grid gap-8">
      <AdminPageHeader
        eyebrow="Catalogue"
        title="Produits"
        description="Gerez votre catalogue, stock, statuts et promotions."
      />

      <Card>
        <CardHeader>
          <CardTitle>Nouveau produit</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createProduct} className="grid gap-4 xl:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="collectionId">Collection</Label>
              <Select id="collectionId" name="collectionId" required>
                <option value="">Choisir...</option>
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid gap-2 xl:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" required />
            </div>
            <div className="grid gap-2 xl:col-span-2">
              <Label htmlFor="details">Details techniques</Label>
              <Textarea id="details" name="details" />
            </div>
            <Input name="price" type="number" placeholder="Prix MAD" required />
            <Input name="discountPrice" type="number" placeholder="Prix promo" />
            <Input name="wholesalePrice" type="number" placeholder="Prix wholesale" />
            <Input name="wholesaleMinQty" type="number" placeholder="Min wholesale" />
            <Input name="stock" type="number" placeholder="Stock" required />
            <Input name="badge" placeholder="Badge" />
            <Select name="status" defaultValue="ACTIVE">
              <option value="ACTIVE">Actif</option>
              <option value="DRAFT">Brouillon</option>
              <option value="ARCHIVED">Archive</option>
            </Select>
            <div className="grid gap-2 xl:col-span-2">
              <Label htmlFor="imageUrls">Images (une URL par ligne)</Label>
              <Textarea id="imageUrls" name="imageUrls" required />
            </div>
            <Button type="submit" disabled={collections.length === 0} className="xl:col-span-2">
              Creer le produit
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des produits</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          <AdminSearchForm
            basePath="/admin/products"
            defaultQuery={params.q}
            filters={[
              {
                name: "status",
                label: "Statut",
                defaultValue: params.status ?? "ALL",
                options: [
                  { value: "ALL", label: "Tous statuts" },
                  { value: "ACTIVE", label: "Actifs" },
                  { value: "DRAFT", label: "Brouillons" },
                  { value: "ARCHIVED", label: "Archives" },
                ],
              },
            ]}
          />

          {products.length > 0 ? (
            <>
              <ProductTable products={products} />
              <AdminPagination
                basePath="/admin/products"
                page={page}
                totalPages={totalPages}
                params={{ q: params.q, status: params.status }}
              />
              <p className="text-sm text-muted-foreground">
                {total} produit{total > 1 ? "s" : ""} · {ADMIN_PAGE_SIZE} par page
              </p>
            </>
          ) : (
            <AdminEmptyState
              icon={PackageSearch}
              title="Aucun produit trouve"
              description="Ajustez vos filtres ou creez votre premier produit."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
