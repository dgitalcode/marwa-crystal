"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import { useCart } from "@/components/store/cart-provider";
import { StoreImage } from "@/components/store/store-image";
import { Button } from "@/components/ui/button";
import { getCartTotal } from "@/lib/pricing";
import { formatMoney } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCart();
  const total = getCartTotal(items, "NORMAL");

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-5xl font-black">Votre panier</h1>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="grid gap-4 rounded-3xl border border-border bg-card p-4 md:grid-cols-[110px_1fr_auto]"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                <StoreImage src={item.image} alt={item.name} fill className="object-cover" sizes="110px" />
              </div>
              <div>
                <Link href={`/products/${item.slug}`} className="font-black">
                  {item.name}
                </Link>
                <p className="mt-2 text-sm text-muted-foreground">
                  {formatMoney(item.discountPrice ?? item.price)}
                </p>
                {item.wholesalePrice ? (
                  <p className="mt-1 text-xs font-bold text-accent">
                    Wholesale des {item.wholesaleMinQty} pcs: {formatMoney(item.wholesalePrice)}
                  </p>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-black">{item.quantity}</span>
                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => removeItem(item.productId)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {items.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card p-10 text-center">
              <p className="font-black">Votre panier est vide.</p>
              <Button asChild className="mt-5">
                <Link href="/collections">Explorer nos produits</Link>
              </Button>
            </div>
          ) : null}
        </div>
        <aside className="h-fit rounded-3xl border border-border bg-card p-6">
          <h2 className="text-2xl font-black">Resume</h2>
          <div className="mt-5 flex justify-between text-lg font-black">
            <span>Total</span>
            <span>{formatMoney(total)}</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Livraison et disponibilite confirmees manuellement sur WhatsApp.
          </p>
          {items.length === 0 ? (
            <Button className="mt-6 w-full" disabled>
              Continuer sur WhatsApp
            </Button>
          ) : (
            <Button asChild className="mt-6 w-full">
              <Link href="/checkout/whatsapp">Continuer sur WhatsApp</Link>
            </Button>
          )}
        </aside>
      </div>
    </section>
  );
}
