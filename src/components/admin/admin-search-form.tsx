"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type FilterField = {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
};

export function AdminSearchForm({
  basePath,
  searchPlaceholder = "Rechercher...",
  defaultQuery = "",
  filters = [],
}: {
  basePath: string;
  searchPlaceholder?: string;
  defaultQuery?: string;
  filters?: FilterField[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="flex flex-col gap-3 lg:flex-row lg:items-center"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const params = new URLSearchParams();
        const q = String(formData.get("q") ?? "").trim();
        if (q) {
          params.set("q", q);
        }
        filters.forEach((filter) => {
          const value = String(formData.get(filter.name) ?? "");
          if (value && value !== "ALL") {
            params.set(filter.name, value);
          }
        });
        startTransition(() => {
          router.push(params.size ? `${basePath}?${params.toString()}` : basePath);
        });
      }}
    >
      <div
        className={cn(
          "flex h-11 w-full min-w-0 flex-1 items-center gap-3 rounded-2xl border border-border bg-card px-4 transition focus-within:ring-2 focus-within:ring-ring",
          isPending && "opacity-50",
        )}
      >
        <Search className="pointer-events-none h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          name="q"
          type="search"
          defaultValue={defaultQuery}
          placeholder={searchPlaceholder}
          disabled={isPending}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
        {filters.map((filter) => (
          <Select
            key={filter.name}
            name={filter.name}
            defaultValue={filter.defaultValue ?? "ALL"}
            disabled={isPending}
            aria-label={filter.label}
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        ))}
        <Button type="submit" variant="accent" disabled={isPending}>
          {isPending ? "..." : "Filtrer"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => startTransition(() => router.push(basePath))}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
