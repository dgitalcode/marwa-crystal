import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductActions } from "@/components/store/product-actions";
import { StoreImage } from "@/components/store/store-image";
import { Badge } from "@/components/ui/badge";
import { getProductBySlug, getProducts } from "@/lib/catalog";
import { formatMoney } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product?.name ?? "Produit",
    description: product?.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !("images" in product)) {
    notFound();
  }

  const related = (await getProducts({ collectionSlug: product.collectionSlug }))
    .filter((entry) => entry.slug !== product.slug)
    .slice(0, 3);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-4 md:grid-cols-[92px_1fr]">
          <div className="hidden gap-3 md:grid">
            {product.images.map((image) => (
              <div key={image} className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                <StoreImage src={image} alt={product.name} fill className="object-cover" sizes="92px" />
              </div>
            ))}
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-muted">
            <StoreImage
              src={product.images[0]}
              alt={product.name}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
        <div className="py-4">
          <Link
            href={`/collections/${product.collectionSlug}`}
            className="text-sm font-black uppercase tracking-[0.2em] text-accent"
          >
            {product.collectionName}
          </Link>
          <h1 className="mt-4 text-4xl font-black md:text-5xl">{product.name}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-2xl font-black text-destructive">
              {formatMoney(product.discountPrice ?? product.price)}
            </span>
            {product.discountPrice ? (
              <span className="text-muted-foreground line-through">
                {formatMoney(product.price)}
              </span>
            ) : null}
            {product.badge ? <Badge variant="danger">{product.badge}</Badge> : null}
          </div>
          <p className="mt-6 leading-8 text-muted-foreground">{product.description}</p>
          <div className="my-8 border-t border-border" />
          <ProductActions product={product} />
          <div className="mt-10 space-y-4">
            <h2 className="text-2xl font-black">Details & service</h2>
            <p className="leading-8 text-muted-foreground">{product.details}</p>
            <ul className="grid gap-2 text-sm font-semibold text-muted-foreground">
              <li>Livraison rapide partout au Maroc</li>
              <li>Paiement a la livraison</li>
              <li>Confirmation manuelle via WhatsApp</li>
              <li>Stock actuel: {product.stock} pieces</li>
            </ul>
          </div>
        </div>
      </div>

      {related.length ? (
        <div className="mt-20">
          <h2 className="text-3xl font-black">Vous aimerez aussi</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/products/${item.slug}`}
                className="rounded-3xl border border-border bg-card p-5 font-black transition hover:shadow-md"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
