import { CollectionCard } from "@/components/store/collection-card";
import { getCollections } from "@/lib/catalog";

export const metadata = {
  title: "Collections",
  description: "Explorez les collections premium Marwa Crystal.",
};

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-accent">
          Collections
        </p>
        <h1 className="mt-4 text-5xl font-black">Choisissez votre style</h1>
        <p className="mt-5 leading-8 text-muted-foreground">
          Parcourez nos univers d&apos;accessoires, des pieces minimalistes aux
          selections plus lumineuses pour occasions speciales.
        </p>
      </div>
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </section>
  );
}
