import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getStoreSettings } from "@/lib/store-settings";

export const metadata = {
  title: "Contact",
  description: "Contactez Marwa Crystal via WhatsApp, telephone ou email.",
};

function formatWhatsAppPhone(phone: string) {
  return phone.replace(/\D/g, "");
}

export default async function ContactPage() {
  const settings = await getStoreSettings();
  const phone =
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE ??
    formatWhatsAppPhone(settings.contactInfo.phone) ??
    "212704460891";
  const email =
    settings.contactInfo.email ??
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ??
    "marwacrystal1@gmail.com";

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-accent">
          Contact
        </p>
        <h1 className="mt-4 text-5xl font-black">Nous contacter</h1>
        <p className="mt-5 leading-8 text-muted-foreground">
          Une question sur un produit, une commande ou le wholesale? Envoyez-nous
          un message et notre equipe vous repond rapidement.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-7">
          <h2 className="text-2xl font-black">Coordonnees</h2>
          <div className="mt-6 grid gap-4 text-muted-foreground">
            <p className="flex gap-3">
              <Mail className="h-5 w-5 text-accent" /> {email}
            </p>
            <p className="flex gap-3">
              <Phone className="h-5 w-5 text-accent" /> {settings.contactInfo.phone}
            </p>
            <p className="flex gap-3">
              <MapPin className="h-5 w-5 text-accent" /> {settings.contactInfo.address}
            </p>
          </div>
          <Button asChild className="mt-7">
            <Link
              href={`https://wa.me/${phone}?text=${encodeURIComponent("Bonjour Marwa Crystal, j'ai une question.")}`}
              target="_blank"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Link>
          </Button>
        </div>
        <div className="rounded-3xl border border-border bg-card p-7">
          <h2 className="text-2xl font-black">Horaires</h2>
          <div className="mt-6 grid gap-3 text-muted-foreground">
            <p>
              <strong className="text-foreground">Lundi - Jeudi:</strong> 9h00 - 19h00
            </p>
            <p>
              <strong className="text-foreground">Vendredi:</strong> 9h00 - 13h00 / 15h00 - 19h00
            </p>
            <p>
              <strong className="text-foreground">Samedi:</strong> 9h00 - 19h00
            </p>
            <p>
              <strong className="text-foreground">Dimanche:</strong> Ferme
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="accent">
              <Link href="https://maps.google.com" target="_blank">Google Maps</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="https://www.waze.com/live-map" target="_blank">Waze</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
