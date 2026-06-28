import Link from "next/link";
import {
  Boxes,
  Gem,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  Package,
  Settings,
  ShieldCheck,
  UserCircle,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { isSuperAdmin } from "@/lib/admin-auth";
import type { Role } from "@/generated/prisma";

const items = [
  ["Dashboard", "/admin", LayoutDashboard],
  ["Collections", "/admin/collections", Boxes],
  ["Produits", "/admin/products", Gem],
  ["Commandes", "/admin/orders", Package],
  ["Clients", "/admin/customers", Users],
  ["Avis", "/admin/reviews", MessageSquareQuote],
  ["Stock", "/admin/stock", Package],
  ["Store Settings", "/admin/settings", Settings],
] as const;

export function AdminSidebar({ role }: { role?: Role }) {
  return (
    <aside className="border-r border-border bg-card p-5">
      <p className="text-lg font-black uppercase tracking-[0.14em] text-accent">
        Admin
      </p>
      <nav className="mt-8 grid gap-2">
        {items.map(([label, href, Icon]) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition hover:bg-muted"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
        {isSuperAdmin(role) ? (
          <Link
            href="/admin/admins"
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition hover:bg-muted"
          >
            <ShieldCheck className="h-4 w-4" />
            Administrateurs
          </Link>
        ) : null}
      </nav>
      <div className="mt-8 grid gap-2">
        <Link
          href="/admin/profile"
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition hover:bg-muted"
        >
          <UserCircle className="h-4 w-4" />
          Mon profil
        </Link>
        <LogoutButton />
      </div>
    </aside>
  );
}

function LogoutButton() {
  return (
    <div className="mt-8">
      <Button asChild variant="outline" className="w-full">
        <Link href="/api/auth/signout">
          <LogOut className="h-4 w-4" />
          Deconnexion
        </Link>
      </Button>
    </div>
  );
}
