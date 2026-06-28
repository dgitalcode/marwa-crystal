export const metadata = {
  title: "A propos",
  description: "Decouvrez l'univers Marwa Crystal.",
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <p className="text-sm font-black uppercase tracking-[0.24em] text-accent">
        A propos
      </p>
      <h1 className="mt-4 text-5xl font-black">Une boutique pensee pour votre elegance.</h1>
      <div className="mt-8 grid gap-8 text-lg leading-9 text-muted-foreground">
        <p>
          Marwa Crystal selectionne des accessoires premium pour accompagner les
          looks modernes: pieces lumineuses, finitions soignees et experience
          d&apos;achat simple via WhatsApp.
        </p>
        <p>
          Notre modele COD permet de commander sans paiement en ligne. Vous
          choisissez vos produits, envoyez votre commande preparee sur WhatsApp,
          puis notre equipe confirme la disponibilite et la livraison.
        </p>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {["Selection premium", "Commande WhatsApp", "Wholesale scalable"].map((item) => (
          <div key={item} className="rounded-3xl border border-border bg-card p-6 font-black">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
