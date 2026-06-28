"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Boxes,
  Gem,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Package,
  Settings,
  ShieldCheck,
  UserCircle,
  Users,
  Warehouse,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Role } from "@/generated/prisma";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Collections", href: "/admin/collections", icon: Boxes },
  { label: "Produits", href: "/admin/products", icon: Gem },
  { label: "Commandes", href: "/admin/orders", icon: Package },
  { label: "Clients", href: "/admin/customers", icon: Users },
  { label: "Avis", href: "/admin/reviews", icon: MessageSquareQuote },
  { label: "Stock", href: "/admin/stock", icon: Warehouse },
  { label: "Parametres", href: "/admin/settings", icon: Settings },
] as const;

function NavLinks({
  role,
  onNavigate,
}: {
  role?: Role;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      <nav className="grid gap-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
              isActive(item.href, "exact" in item ? item.exact : undefined)
                ? "bg-accent/15 text-accent"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        ))}
        {role === "SUPER_ADMIN" ? (
          <Link
            href="/admin/admins"
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
              isActive("/admin/admins")
                ? "bg-accent/15 text-accent"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <ShieldCheck className="h-4 w-4 shrink-0" />
            Administrateurs
          </Link>
        ) : null}
      </nav>
      <div className="mt-6 grid gap-1 border-t border-border pt-6">
        <Link
          href="/admin/profile"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
            isActive("/admin/profile")
              ? "bg-accent/15 text-accent"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <UserCircle className="h-4 w-4 shrink-0" />
          Mon profil
        </Link>
        <Button asChild variant="outline" className="mt-2 w-full justify-start">
          <Link href="/api/auth/signout" onClick={onNavigate}>
            <LogOut className="h-4 w-4" />
            Deconnexion
          </Link>
        </Button>
      </div>
    </>
  );
}

export function AdminLayoutShell({
  role,
  children,
}: {
  role?: Role;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">Admin</p>
          <p className="text-sm font-black">Marwa Crystal</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Ouvrir le menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Fermer le menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-[min(88vw,320px)] flex-col bg-card p-5 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">Admin</p>
                <p className="text-lg font-black">Marwa Crystal</p>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <NavLinks role={role} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[280px_1fr]">
        <aside className="hidden min-h-[calc(100vh-0px)] border-r border-border bg-card p-5 lg:sticky lg:top-0 lg:block lg:h-screen lg:overflow-y-auto">
          <div className="mb-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">Admin</p>
            <p className="text-xl font-black">Marwa Crystal</p>
            <p className="mt-1 text-xs text-muted-foreground">E-commerce dashboard</p>
          </div>
          <NavLinks role={role} />
        </aside>
        <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
