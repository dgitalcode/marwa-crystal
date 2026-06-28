"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import type { ProductSort } from "@/lib/catalog";

const SORT_LABELS: Record<ProductSort, string> = {
  featured: "En vedette",
  newest: "Nouveautes",
  "price-asc": "Prix croissant",
  "price-desc": "Prix decroissant",
  name: "Nom A-Z",
};

export function CollectionProductToolbar({
  slug,
  productCount,
}: {
  slug: string;
  productCount: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const sort = (searchParams.get("sort") as ProductSort) || "featured";
  const inStock = searchParams.get("stock") === "1";
  const onSale = searchParams.get("promo") === "1";

  function applyParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    startTransition(() => {
      const query = params.toString();
      router.push(query ? `/collections/${slug}?${query}` : `/collections/${slug}`);
    });
  }

  return (
    <div className="mt-12 border-y border-border py-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button
          type="button"
          variant="ghost"
          disabled={isPending}
          onClick={() => setFiltersOpen((open) => !open)}
          aria-expanded={filtersOpen}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtres
          {(inStock || onSale) && (
            <span className="ml-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-black text-accent-foreground">
              {(inStock ? 1 : 0) + (onSale ? 1 : 0)}
            </span>
          )}
        </Button>

        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-bold text-muted-foreground" htmlFor="collection-sort">
            Trier par:
          </label>
          <Select
            id="collection-sort"
            value={sort}
            disabled={isPending}
            onChange={(event) => {
              applyParams({ sort: event.target.value });
            }}
            className="h-10 min-w-[180px]"
          >
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <p className="text-sm font-bold text-muted-foreground">
            {productCount} produit{productCount > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {filtersOpen ? (
        <div className="mt-4 flex flex-wrap gap-3 rounded-2xl border border-border bg-card p-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={inStock}
              disabled={isPending}
              onChange={(event) => {
                applyParams({ stock: event.target.checked ? "1" : null });
              }}
              className="h-4 w-4 accent-accent"
            />
            En stock uniquement
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={onSale}
              disabled={isPending}
              onChange={(event) => {
                applyParams({ promo: event.target.checked ? "1" : null });
              }}
              className="h-4 w-4 accent-accent"
            />
            En promotion
          </label>
          {(inStock || onSale || sort !== "featured") && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => {
                setFiltersOpen(false);
                startTransition(() => router.push(`/collections/${slug}`));
              }}
            >
              Reinitialiser
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
