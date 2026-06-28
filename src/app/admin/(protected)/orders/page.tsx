import { PackageSearch } from "lucide-react";
import type { OrderStatus } from "@/generated/prisma";

import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminSearchForm } from "@/components/admin/admin-search-form";
import { OrderTable } from "@/components/admin/order-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ADMIN_PAGE_SIZE, getPaginationParams, getTotalPages } from "@/lib/admin-pagination";
import { prisma } from "@/lib/prisma";

type SearchParams = Promise<{ q?: string; status?: string; page?: string }>;

async function getOrders(searchParams: { q?: string; status?: string; page?: string }) {
  const { page, skip, take } = getPaginationParams(searchParams.page);
  const q = searchParams.q?.trim();
  const status =
    searchParams.status && searchParams.status !== "ALL"
      ? (searchParams.status as OrderStatus)
      : undefined;

  const where = {
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { orderNumber: { contains: q, mode: "insensitive" as const } },
            { customer: { name: { contains: q, mode: "insensitive" as const } } },
            { customer: { phone: { contains: q, mode: "insensitive" as const } } },
          ],
        }
      : {}),
  };

  try {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
        include: {
          customer: true,
          items: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders: orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        customerType: order.customerType,
        total: order.total,
        createdAt: order.createdAt.toISOString(),
        customer: {
          name: order.customer.name,
          phone: order.customer.phone,
          city: order.customer.city,
          email: order.customer.email,
        },
        items: order.items.map((item) => ({
          id: item.id,
          productName: item.productName,
          quantity: item.quantity,
          lineTotal: item.lineTotal,
        })),
      })),
      total,
      page,
    };
  } catch {
    return { orders: [], total: 0, page: 1 };
  }
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const { orders, total, page } = await getOrders(params);
  const totalPages = getTotalPages(total);

  return (
    <div className="grid gap-8">
      <AdminPageHeader
        eyebrow="Operations"
        title="Commandes"
        description="Suivez les commandes WhatsApp, consultez les details clients et mettez a jour les statuts."
      />

      <Card>
        <CardHeader>
          <CardTitle>Liste des commandes</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          <AdminSearchForm
            basePath="/admin/orders"
            defaultQuery={params.q}
            searchPlaceholder="Rechercher par numero, client ou telephone..."
            filters={[
              {
                name: "status",
                label: "Statut",
                defaultValue: params.status ?? "ALL",
                options: [
                  { value: "ALL", label: "Tous statuts" },
                  { value: "PENDING", label: "En attente" },
                  { value: "CONTACTED", label: "Contacte" },
                  { value: "CONFIRMED", label: "Confirmee" },
                  { value: "FULFILLED", label: "Livree" },
                  { value: "CANCELLED", label: "Annulee" },
                ],
              },
            ]}
          />

          {orders.length > 0 ? (
            <>
              <OrderTable orders={orders} />
              <AdminPagination
                basePath="/admin/orders"
                page={page}
                totalPages={totalPages}
                params={{ q: params.q, status: params.status }}
              />
              <p className="text-sm text-muted-foreground">
                {total} commande{total > 1 ? "s" : ""} · {ADMIN_PAGE_SIZE} par page
              </p>
            </>
          ) : (
            <AdminEmptyState
              icon={PackageSearch}
              title="Aucune commande"
              description="Les commandes creees depuis le checkout WhatsApp apparaitront ici."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
