import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  Headphones,
  MessageCircle,
  Package,
  Sparkles,
  Truck,
} from "lucide-react";

import { WholesaleProductCard } from "@/components/store/wholesale/wholesale-product-card";
import { WholesaleQuoteForm } from "@/components/store/wholesale/wholesale-quote-form";
import { Button } from "@/components/ui/button";
import { getWholesaleProducts } from "@/lib/catalog";

export const metadata = {
  title: "Wholesale B2B",
  description:
    "Commandes en gros Marwa Crystal: prix professionnels, grandes quantites, livraison au Maroc et accompagnement via WhatsApp.",
  openGraph: {
    title: "Wholesale B2B | Marwa Crystal",
    description:
      "Solutions wholesale pour revendeurs, hotels, decorateurs et acheteurs professionnels au Maroc.",
  },
};

const BENEFITS = [
  {
    icon: Sparkles,
    title: "Prix professionnels",
    text: "Tarifs de gros competitifs pour maximiser vos marges.",
  },
  {
    icon: Boxes,
    title: "Grandes quantites",
    text: "Stock disponible pour vos commandes volume et reapprovisionnements.",
  },
  {
    icon: Truck,
    title: "Livraison Maroc",
    text: "Expedition partout au Maroc avec suivi et confirmation.",
  },
  {
    icon: Headphones,
    title: "Accompagnement dedie",
    text: "Conseil personnalise pour vos selections et vos besoins B2B.",
  },
  {
    icon: MessageCircle,
    title: "Commande WhatsApp",
    text: "Devis rapide, validation humaine et process simple.",
  },
] as const;

const STEPS = [
  {
    step: "01",
    title: "Choisir les produits",
    text: "Parcourez notre catalogue wholesale et selectionnez vos references.",
  },
  {
    step: "02",
    title: "Envoyer la demande",
    text: "Remplissez le formulaire ou contactez-nous avec vos quantites.",
  },
  {
    step: "03",
    title: "Confirmation WhatsApp",
    text: "Notre equipe confirme prix, disponibilite et livraison.",
  },
] as const;

export default async function WholesalePage() {
  const products = await getWholesaleProducts(6);

  return (
    <div>
      <section className="relative overflow-hidden px-4 py-20 text-primary-foreground md:py-28">
        <Image
          src="/images/bg-hero.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-accent sm:text-sm">
              Wholesale B2B
            </p>
            <h1 className="mt-5 text-4xl font-black leading-[0.95] sm:text-5xl md:text-6xl">
              Solutions professionnelles pour vos achats en gros
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-primary-foreground/80 sm:text-lg">
              Marwa Crystal accompagne les revendeurs, hotels, decorateurs et entreprises
              avec des prix de gros, des volumes flexibles et un service premium via WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="accent">
                <Link href="#devis">
                  Demander un devis
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 text-primary-foreground hover:bg-white/10"
              >
                <Link href="#catalogue">Commander en gros</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-accent sm:text-sm">
            Avantages
          </p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Pourquoi choisir notre wholesale</h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-3xl border border-border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent/15 text-accent">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-black">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted/35 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-accent sm:text-sm">
              Processus
            </p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Comment ca marche</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map(({ step, title, text }) => (
              <div key={step} className="rounded-3xl border border-border bg-card p-7 shadow-sm">
                <p className="text-3xl font-black text-accent">{step}</p>
                <h3 className="mt-4 text-xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="catalogue" className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-accent sm:text-sm">
              Catalogue wholesale
            </p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Produits disponibles en gros</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              Selection de pieces avec tarifs professionnels et quantites minimales.
            </p>
          </div>
          <Button asChild variant="ghost">
            <Link href="/collections">
              Voir tout le catalogue
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {products.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <WholesaleProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-8 flex items-center gap-4 rounded-3xl border border-dashed border-border bg-muted/20 p-8">
            <Package className="h-8 w-8 text-accent" />
            <div>
              <p className="font-black">Catalogue wholesale en preparation</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Contactez-nous pour recevoir la liste complete des references disponibles.
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="bg-muted/35 px-4 py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-accent sm:text-sm">
              Devis B2B
            </p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Demandez votre devis wholesale</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Remplissez le formulaire ci-contre. Votre demande sera preparee automatiquement
              sur WhatsApp avec un message professionnel pre-rempli pour un traitement rapide.
            </p>
            <ul className="mt-6 grid gap-2 text-sm text-muted-foreground">
              <li>Reponse rapide par notre equipe commerciale</li>
              <li>Devis personnalise selon vos quantites</li>
              <li>Livraison partout au Maroc</li>
            </ul>
          </div>
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm md:p-8">
            <WholesaleQuoteForm />
          </div>
        </div>
      </section>
    </div>
  );
}
