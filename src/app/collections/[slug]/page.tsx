import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CollectionProductToolbar } from "@/components/store/collection-product-toolbar";
import { ProductCard } from "@/components/store/product-card";
import { getCollections, getProducts, type ProductSort } from "@/lib/catalog";

const VALID_SORTS: ProductSort[] = ["featured", "newest", "price-asc", "price-desc", "name"];

function parseSort(value?: string): ProductSort {
  if (value && VALID_SORTS.includes(value as ProductSort)) {
    return value as ProductSort;
  }
  return "featured";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = (await getCollections()).find((entry) => entry.slug === slug);
  return {
    title: collection?.name ?? "Collection",
    description: collection?.description,
  };
}

type SearchParams = Promise<{ sort?: string; stock?: string; promo?: string }>;

export default async function CollectionDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const sort = parseSort(query.sort);
  const inStockOnly = query.stock === "1";
  const onSaleOnly = query.promo === "1";

  const [collections, products] = await Promise.all([
    getCollections(),
    getProducts({
      collectionSlug: slug,
      sort,
      inStockOnly,
      onSaleOnly,
    }),
  ]);
  const collection = collections.find((entry) => entry.slug === slug);

  if (!collection) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-accent">
          Collection
        </p>
        <h1 className="mt-4 text-5xl font-black">{collection.name}</h1>
        <p className="mt-5 leading-8 text-muted-foreground">{collection.description}</p>
      </div>

      <Suspense fallback={null}>
        <CollectionProductToolbar slug={slug} productCount={products.length} />
      </Suspense>

      {products.length > 0 ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center">
          <p className="font-black">Aucun produit ne correspond a vos filtres.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Modifiez les filtres ou reinitialisez la selection.
          </p>
        </div>
      )}
    </section>
  );
}
