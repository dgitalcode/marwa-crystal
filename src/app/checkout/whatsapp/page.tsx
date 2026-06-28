import { Suspense } from "react";

import { WhatsAppCheckoutClient } from "@/components/store/whatsapp-checkout-client";

export default function WhatsAppCheckoutPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-accent">
          Checkout WhatsApp
        </p>
        <h1 className="mt-4 text-5xl font-black">Confirmez votre commande</h1>
        <p className="mt-5 leading-8 text-muted-foreground">
          Remplissez vos informations. Nous preparons un message professionnel
          avec vos produits, quantites, prix et total.
        </p>
      </div>
      <Suspense fallback={<div className="mt-12 rounded-3xl bg-card p-8">Chargement...</div>}>
        <WhatsAppCheckoutClient />
      </Suspense>
    </section>
  );
}
