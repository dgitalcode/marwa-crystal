"use client";

import { useTransition } from "react";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { buildWholesaleQuoteMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

export function WholesaleQuoteForm() {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      id="devis"
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const name = String(formData.get("name") ?? "").trim();
        const phone = String(formData.get("phone") ?? "").trim();
        const city = String(formData.get("city") ?? "").trim();
        const quantity = String(formData.get("quantity") ?? "").trim();

        if (name.length < 2 || phone.length < 8 || city.length < 2 || quantity.length < 1) {
          toast.error("Veuillez remplir tous les champs obligatoires.");
          return;
        }

        startTransition(() => {
          const message = buildWholesaleQuoteMessage({
            name,
            company: String(formData.get("company") ?? "").trim() || undefined,
            phone,
            whatsapp: String(formData.get("whatsapp") ?? "").trim() || undefined,
            city,
            message: String(formData.get("message") ?? "").trim() || undefined,
            quantity,
          });

          window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
          toast.success("Votre demande est prete sur WhatsApp.");
        });
      }}
    >
      <div className="grid gap-2 sm:col-span-1">
        <Label htmlFor="wholesale-name">Nom *</Label>
        <Input id="wholesale-name" name="name" required minLength={2} disabled={isPending} />
      </div>
      <div className="grid gap-2 sm:col-span-1">
        <Label htmlFor="wholesale-company">Entreprise</Label>
        <Input id="wholesale-company" name="company" disabled={isPending} />
      </div>
      <div className="grid gap-2 sm:col-span-1">
        <Label htmlFor="wholesale-phone">Telephone *</Label>
        <Input
          id="wholesale-phone"
          name="phone"
          type="tel"
          required
          minLength={8}
          disabled={isPending}
        />
      </div>
      <div className="grid gap-2 sm:col-span-1">
        <Label htmlFor="wholesale-whatsapp">WhatsApp</Label>
        <Input id="wholesale-whatsapp" name="whatsapp" type="tel" disabled={isPending} />
      </div>
      <div className="grid gap-2 sm:col-span-1">
        <Label htmlFor="wholesale-city">Ville *</Label>
        <Input id="wholesale-city" name="city" required minLength={2} disabled={isPending} />
      </div>
      <div className="grid gap-2 sm:col-span-1">
        <Label htmlFor="wholesale-quantity">Quantite souhaitee *</Label>
        <Input
          id="wholesale-quantity"
          name="quantity"
          placeholder="Ex: 50 pieces, 3 cartons..."
          required
          disabled={isPending}
        />
      </div>
      <div className="grid gap-2 sm:col-span-2">
        <Label htmlFor="wholesale-message">Message</Label>
        <Textarea
          id="wholesale-message"
          name="message"
          rows={4}
          placeholder="Precisez les references, collections ou besoins specifiques..."
          disabled={isPending}
        />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" variant="accent" size="lg" className="w-full sm:w-auto" disabled={isPending}>
          <MessageCircle className="h-4 w-4" />
          {isPending ? "Preparation..." : "Envoyer sur WhatsApp"}
        </Button>
      </div>
    </form>
  );
}
