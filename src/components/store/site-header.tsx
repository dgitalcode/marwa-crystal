"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Search, ShoppingBag, X } from "lucide-react";

import { useCart } from "@/components/store/cart-provider";
import { StoreLogo } from "@/components/store/store-logo";
import { StoreImage } from "@/components/store/store-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatMoney } from "@/lib/utils";
import type { HeaderNavLink } from "@/types/navigation";
import type { StoreBranding } from "@/types/store-settings";

type SearchResult = {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  collectionName: string;
};

function SidePanel({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-50 bg-black/40"
        aria-label="Fermer"
        onClick={onClose}
      />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="text-lg font-black uppercase tracking-wide">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fermer">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </aside>
    </>
  );
}

export function SiteHeader({
  navLinks,
  branding,
}: {
  navLinks: HeaderNavLink[];
  branding: StoreBranding;
}) {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchOpen) {
      setQuery("");
      setResults([]);
      return;
    }

    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as SearchResult[];
        setResults(data);
      } catch {
        if (!controller.signal.aborted) {
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [query, searchOpen]);

  function closePanels() {
    setMenuOpen(false);
    setSearchOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        {branding.announcementEnabled ? (
          <div
            className="px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.24em]"
            style={{
              backgroundColor: branding.announcementStyle.backgroundColor,
              color: branding.announcementStyle.textColor,
            }}
          >
            {branding.announcementText}
          </div>
        ) : null}
        <div className="mx-auto flex max-w-7xl items-center gap-5 px-4 py-5">
          <StoreLogo branding={branding} variant="header" className="mr-auto" />
          <nav className="hidden flex-wrap justify-center gap-x-7 gap-y-3 text-xs font-black uppercase tracking-wide lg:flex">
            {navLinks.map((item) => (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                className="transition hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Rechercher"
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(true);
              }}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button asChild variant="ghost" size="icon" aria-label="Panier">
              <Link href="/cart" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 ? (
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px] font-black text-accent-foreground">
                    {totalItems}
                  </span>
                ) : null}
              </Link>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label="Menu"
              onClick={() => {
                setSearchOpen(false);
                setMenuOpen(true);
              }}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <SidePanel open={searchOpen} onClose={() => setSearchOpen(false)} title="Recherche">
        <div className="grid gap-5">
          <Input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher un produit..."
          />
          {isSearching ? (
            <p className="text-sm text-muted-foreground">Recherche en cours...</p>
          ) : null}
          {!isSearching && query.trim() && results.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun produit trouve.</p>
          ) : null}
          <div className="grid gap-3">
            {results.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                onClick={closePanels}
                className="flex items-center gap-4 rounded-2xl border border-border bg-background p-3 transition hover:bg-muted"
              >
                <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-muted">
                  <StoreImage
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div>
                  <p className="font-black">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.collectionName}</p>
                  <p className="mt-1 text-sm font-bold text-accent">
                    {formatMoney(product.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </SidePanel>

      <SidePanel open={menuOpen} onClose={() => setMenuOpen(false)} title="Menu">
        <nav className="grid gap-2">
          {navLinks.map((item) => (
            <Link
              key={`${item.label}-${item.href}`}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-2xl border border-border bg-background px-4 py-4 text-sm font-black uppercase tracking-wide transition hover:bg-muted"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </SidePanel>
    </>
  );
}
