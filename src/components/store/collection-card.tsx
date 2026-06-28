import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { StoreImage } from "@/components/store/store-image";

import type { CollectionSummary } from "@/types/commerce";

export function CollectionCard({ collection }: { collection: CollectionSummary }) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="group relative min-h-[360px] overflow-hidden rounded-3xl bg-primary text-primary-foreground"
    >
      <StoreImage
        src={collection.image}
        alt={collection.name}
        fill
        className="object-cover opacity-75 transition duration-500 group-hover:scale-105"
        sizes="(min-width: 1024px) 33vw, 100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-7 text-primary-foreground">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-accent">
          {collection.productCount} pieces
        </p>
        <h3 className="mt-2 text-2xl font-black text-primary-foreground">
          {collection.name}
        </h3>
        <p className="mt-3 max-w-sm text-sm leading-6 text-primary-foreground/80">
          {collection.description}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide text-primary-foreground">
          Explorer <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
