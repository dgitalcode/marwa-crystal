import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";

import { CollectionCard } from "@/components/store/collection-card";
import { CustomerReviewsSection } from "@/components/store/customer-reviews-section";
import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { getCollections, getProducts } from "@/lib/catalog";

export default async function HomePage() {
  const [collections, products] = await Promise.all([
    getCollections(),
    getProducts({ featured: true }),
  ]);

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
        <div className="absolute inset-0 bg-gradient-to-r from-primary/92 via-primary/78 to-primary/55" />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-accent">
              Nouvelle collection
            </p>
            <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[0.95] md:text-7xl">
              Accessoires premium, commandes simples via WhatsApp.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-primary-foreground/75">
              Une experience boutique moderne pour decouvrir, choisir et confirmer
              vos pieces favorites avec paiement a la livraison.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="accent">
                <Link href="/collections">
                  Explorer la boutique <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Link href="/wholesale">Commander wholesale</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-4 rounded-[2rem] border border-white/15 bg-white/10 p-4 backdrop-blur">
            <div className="rounded-[1.5rem] bg-card p-8 text-foreground">
              <p className="font-serif text-5xl italic text-accent">Marwa Crystal</p>
              <p className="mt-4 text-sm font-bold uppercase tracking-[0.22em]">
              Cristal | Porcelaine | Luminaires
              </p>
              <p className="mt-10 text-3xl font-black">
                -20% sur les selections lancement
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 md:grid-cols-3">
        {[
          [Truck, "Livraison COD", "Paiement a la livraison partout au Maroc."],
          [ShieldCheck, "Commande confirmee", "Validation manuelle et rapide via WhatsApp."],
          [Sparkles, "Wholesale disponible", "Prix bulk pour revendeurs et commandes volume."],
        ].map(([Icon, title, text]) => (
          <div key={title as string} className="rounded-3xl border border-border bg-card p-6">
            <Icon className="h-7 w-7 text-accent" />
            <h2 className="mt-4 font-black">{title as string}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{text as string}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-accent">
              Collections
            </p>
            <h2 className="mt-2 text-4xl font-black">Acheter par univers</h2>
          </div>
          <Button asChild variant="ghost">
            <Link href="/collections">Voir tout</Link>
          </Button>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {collections.slice(0, 3).map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-accent">
              Selection
            </p>
            <h2 className="mt-2 text-4xl font-black">Nouveautes & promotions</h2>
          </div>
          <Button asChild variant="ghost">
            <Link href="/collections">Voir plus</Link>
          </Button>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <CustomerReviewsSection />

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-[2rem] bg-card p-10 text-center shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-accent">
            Experience boutique
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-black">
            Quand l&apos;accessoire devient signature.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-muted-foreground">
            Des pieces selectionnees pour leur brillance, leur finition et leur
            capacite a transformer une tenue en un look elegant.
          </p>
        </div>
      </section>
    </div>
  );
}
