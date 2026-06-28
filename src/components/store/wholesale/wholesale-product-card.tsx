import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { StoreImage } from "@/components/store/store-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils";
import type { ProductSummary } from "@/types/commerce";

export function WholesaleProductCard({ product }: { product: ProductSummary }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-muted">
        <StoreImage
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
        <Badge variant="accent" className="absolute left-4 top-4">
          Wholesale
        </Badge>
      </Link>
      <div className="space-y-3 p-5">
        <div>
          <Link href={`/products/${product.slug}`} className="font-black leading-tight hover:text-accent">
            {product.name}
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">{product.collectionName}</p>
        </div>
        <div className="rounded-2xl bg-muted/50 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Prix professionnel
          </p>
          <p className="mt-1 text-xl font-black text-accent">
            {product.wholesalePrice ? formatMoney(product.wholesalePrice) : "Sur devis"}
          </p>
          {product.wholesaleMinQty ? (
            <p className="mt-1 text-xs font-semibold text-muted-foreground">
              Minimum: {product.wholesaleMinQty} pieces
            </p>
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">
          Prix public: {formatMoney(product.discountPrice ?? product.price)}
        </p>
        <Button asChild variant="outline" className="w-full">
          <Link href="#devis">
            Demander un devis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
}
