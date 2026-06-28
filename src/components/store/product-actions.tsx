"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Minus, Plus, ShoppingBag } from "lucide-react";

import { useCart } from "@/components/store/cart-provider";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils";

type ProductActionProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    discountPrice: number | null;
    wholesalePrice: number | null;
    wholesaleMinQty: number | null;
    stock: number;
    images: string[];
  };
};

export function ProductActions({ product }: ProductActionProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const unitPrice = product.discountPrice ?? product.price;
  const whatsappText = encodeURIComponent(
    `Bonjour Marwa Crystal,\nJe souhaite commander:\n- Produit: ${product.name}\n- Quantite: ${quantity}\n- Prix: ${formatMoney(unitPrice)}\n- Total: ${formatMoney(unitPrice * quantity)}\n\nMerci de me confirmer la disponibilite.`,
  );
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "212704460891";

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-sm font-bold">Quantite</p>
        <div className="inline-flex items-center rounded-full border border-border bg-card">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-10 text-center font-black">{quantity}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setQuantity((value) => value + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {product.wholesalePrice ? (
        <div className="rounded-3xl border border-accent/40 bg-accent/10 p-4">
          <p className="font-black">Option wholesale disponible</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatMoney(product.wholesalePrice)} par piece a partir de{" "}
            {product.wholesaleMinQty} pieces.
          </p>
        </div>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          type="button"
          variant="accent"
          disabled={product.stock <= 0}
          onClick={() =>
            addItem(
              {
                productId: product.id,
                slug: product.slug,
                name: product.name,
                image: product.images[0],
                price: product.price,
                discountPrice: product.discountPrice,
                wholesalePrice: product.wholesalePrice,
                wholesaleMinQty: product.wholesaleMinQty,
              },
              quantity,
            )
          }
        >
          <ShoppingBag className="h-4 w-4" />
          Ajouter au panier
        </Button>
        <Button asChild disabled={product.stock <= 0}>
          <Link href={`https://wa.me/${phone}?text=${whatsappText}`} target="_blank">
            <MessageCircle className="h-4 w-4" />
            Commander WhatsApp
          </Link>
        </Button>
      </div>
    </div>
  );
}
