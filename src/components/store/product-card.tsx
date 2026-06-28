"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { StoreImage } from "@/components/store/store-image";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/utils";
import type { ProductSummary } from "@/types/commerce";
import { useCart } from "@/components/store/cart-provider";

export function ProductCard({ product }: { product: ProductSummary }) {
  const { addItem } = useCart();

  return (
    <article className="group overflow-hidden rounded-3xl bg-card shadow-sm">
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-muted">
        <StoreImage
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
        {product.badge ? (
          <Badge variant="danger" className="absolute left-4 top-4">
            {product.badge}
          </Badge>
        ) : null}
      </Link>
      <div className="space-y-3 p-5">
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="font-black leading-tight">{product.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{product.collectionName}</p>
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-black text-destructive">
            {formatMoney(product.discountPrice ?? product.price)}
          </span>
          {product.discountPrice ? (
            <span className="text-sm text-muted-foreground line-through">
              {formatMoney(product.price)}
            </span>
          ) : null}
        </div>
        {product.wholesalePrice ? (
          <p className="text-xs font-bold text-accent">
            Wholesale: {formatMoney(product.wholesalePrice)} des {product.wholesaleMinQty} pcs
          </p>
        ) : null}
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() =>
            addItem({
              productId: product.id,
              slug: product.slug,
              name: product.name,
              image: product.image,
              price: product.price,
              discountPrice: product.discountPrice,
              wholesalePrice: product.wholesalePrice,
              wholesaleMinQty: product.wholesaleMinQty,
            })
          }
        >
          <ShoppingBag className="h-4 w-4" />
          Ajouter
        </Button>
      </div>
    </article>
  );
}
