import Link from "next/link";
import {
  AlertTriangle,
  Boxes,
  Gem,
  MessageSquareQuote,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { OrderStatusBadge } from "@/components/admin/admin-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDashboardMoney, getDashboardOverview } from "@/lib/admin-dashboard";
import { formatMoney } from "@/lib/utils";

function formatDate(value: string) {
  return new Date(value).toLocaleString("fr-MA", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminDashboardPage() {
  const overview = await getDashboardOverview();
  const { stats } = overview;

  return (
    <div className="grid gap-8">
      <AdminPageHeader
        eyebrow="Dashboard"
        title="Vue d'ensemble boutique"
        description="Suivez vos ventes, commandes, stock et activite recente en un coup d'oeil."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <AdminStatCard label="Produits" value={stats.products} icon={Gem} href="/admin/products" />
        <AdminStatCard
          label="Collections"
          value={stats.collections}
          icon={Boxes}
          href="/admin/collections"
        />
        <AdminStatCard
          label="Commandes"
          value={stats.orders}
          icon={Package}
          href="/admin/orders"
          hint={`${stats.pendingOrders} en attente`}
        />
        <AdminStatCard label="Clients" value={stats.customers} icon={Users} href="/admin/customers" />
        <AdminStatCard
          label="Avis"
          value={stats.reviews}
          icon={MessageSquareQuote}
          href="/admin/reviews"
        />
        <AdminStatCard
          label="Chiffre d'affaires"
          value={formatDashboardMoney(stats.revenue)}
          icon={ShoppingBag}
          tone="accent"
          hint="Hors commandes annulees"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Ventes par statut</CardTitle>
            <Link href="/admin/orders" className="text-sm font-semibold text-accent">
              Voir commandes
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-3 py-3">Statut</th>
                    <th className="px-3 py-3">Commandes</th>
                    <th className="px-3 py-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.salesByStatus.map((row) => (
                    <tr key={row.status} className="border-b border-border last:border-0">
                      <td className="px-3 py-3">
                        <OrderStatusBadge status={row.status} />
                      </td>
                      <td className="px-3 py-3 font-semibold">{row.count}</td>
                      <td className="px-3 py-3 font-semibold">{formatMoney(row.total)}</td>
                    </tr>
                  ))}
                  {overview.salesByStatus.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-3 py-8 text-center text-muted-foreground">
                        Aucune commande pour le moment.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className={stats.lowStockProducts > 0 ? "border-destructive/20" : undefined}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {stats.lowStockProducts > 0 ? (
                <AlertTriangle className="h-4 w-4 text-destructive" />
              ) : null}
              Alertes stock
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <AdminStatCard
              label="Stock faible"
              value={stats.lowStockProducts}
              icon={AlertTriangle}
              href="/admin/stock"
              tone={stats.lowStockProducts > 0 ? "warning" : "default"}
              hint="Produits actifs avec stock <= 5"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Activite recente — Commandes</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {overview.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="font-black">{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.customerName} · {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <OrderStatusBadge status={order.status} />
                  <p className="font-black">{formatMoney(order.total)}</p>
                </div>
              </div>
            ))}
            {overview.recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune commande recente.</p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avis recents</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {overview.recentReviews.map((review) => (
              <div key={review.id} className="rounded-xl border border-border bg-background p-4">
                <p className="font-black">{review.customerName}</p>
                <p className="text-xs text-accent">{review.rating}/5 · {formatDate(review.createdAt)}</p>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{review.content}</p>
              </div>
            ))}
            {overview.recentReviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun avis recent.</p>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mouvements de stock recents</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-3">Produit</th>
                <th className="px-3 py-3">Quantite</th>
                <th className="px-3 py-3">Motif</th>
                <th className="px-3 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {overview.recentStockMovements.map((movement) => (
                <tr key={movement.id} className="border-b border-border last:border-0">
                  <td className="px-3 py-3 font-semibold">{movement.productName}</td>
                  <td className="px-3 py-3">{movement.quantity}</td>
                  <td className="px-3 py-3 text-muted-foreground">{movement.reason}</td>
                  <td className="px-3 py-3 text-muted-foreground">{formatDate(movement.createdAt)}</td>
                </tr>
              ))}
              {overview.recentStockMovements.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-8 text-center text-muted-foreground">
                    Aucun mouvement de stock enregistre.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
