"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";

import { createWhatsAppOrder } from "@/actions/orders";
import { useCart } from "@/components/store/cart-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getCartTotal } from "@/lib/pricing";
import { formatMoney } from "@/lib/utils";
import type { CustomerType } from "@/types/commerce";

export function WhatsAppCheckoutClient() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") === "WHOLESALE" ? "WHOLESALE" : "NORMAL";
  const { items, clearCart } = useCart();
  const [customerType, setCustomerType] = useState<CustomerType>(initialType);
  const [isPending, setIsPending] = useState(false);
  const total = useMemo(() => getCartTotal(items, customerType), [customerType, items]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (items.length === 0) {
      toast.error("Votre panier est vide.");
      return;
    }

    setIsPending(true);
    const formData = new FormData(event.currentTarget);
    const result = await createWhatsAppOrder({
      name: formData.get("name"),
      phone: formData.get("phone"),
      city: formData.get("city"),
      address: formData.get("address"),
      note: formData.get("note"),
      customerType,
      items,
    });
    setIsPending(false);
    clearCart();
    window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_380px]">
      <form onSubmit={onSubmit} className="grid gap-5 rounded-3xl border border-border bg-card p-6">
        <div className="grid gap-2">
          <Label htmlFor="customerType">Type de client</Label>
          <Select
            id="customerType"
            value={customerType}
            onChange={(event) => setCustomerType(event.target.value as CustomerType)}
          >
            <option value="NORMAL">Client normal</option>
            <option value="WHOLESALE">Client wholesale</option>
          </Select>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom complet</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Telephone</Label>
            <Input id="phone" name="phone" required />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="city">Ville</Label>
            <Input id="city" name="city" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Adresse</Label>
            <Input id="address" name="address" required />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="note">Note</Label>
          <Textarea id="note" name="note" placeholder="Couleur, preferences, disponibilite..." />
        </div>
        <Button type="submit" size="lg" disabled={isPending || items.length === 0}>
          <MessageCircle className="h-4 w-4" />
          {isPending ? "Preparation..." : "Ouvrir WhatsApp"}
        </Button>
      </form>

      <aside className="h-fit rounded-3xl border border-border bg-card p-6">
        <h2 className="text-2xl font-black">Resume commande</h2>
        <div className="mt-5 grid gap-4">
          {items.map((item) => (
            <div key={item.productId} className="border-b border-border pb-4">
              <p className="font-black">{item.name}</p>
              <p className="text-sm text-muted-foreground">Quantite: {item.quantity}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-between text-xl font-black">
          <span>Total</span>
          <span>{formatMoney(total)}</span>
        </div>
        {customerType === "WHOLESALE" ? (
          <p className="mt-3 text-sm font-semibold text-accent">
            Les prix wholesale s&apos;appliquent seulement si les quantites minimum
            par produit sont atteintes.
          </p>
        ) : null}
      </aside>
    </div>
  );
}
