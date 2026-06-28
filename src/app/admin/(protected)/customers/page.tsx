import { Users } from "lucide-react";
import type { CustomerType } from "@/generated/prisma";

import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminSearchForm } from "@/components/admin/admin-search-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ADMIN_PAGE_SIZE, getPaginationParams, getTotalPages } from "@/lib/admin-pagination";
import { prisma } from "@/lib/prisma";

type SearchParams = Promise<{ q?: string; type?: string; page?: string }>;

async function getCustomers(searchParams: { q?: string; type?: string; page?: string }) {
  const { page, skip, take } = getPaginationParams(searchParams.page);
  const q = searchParams.q?.trim();
  const type =
    searchParams.type && searchParams.type !== "ALL"
      ? (searchParams.type as CustomerType)
      : undefined;

  const where = {
    ...(type ? { type } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { phone: { contains: q, mode: "insensitive" as const } },
            { city: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  try {
    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
        include: { _count: { select: { orders: true } } },
      }),
      prisma.customer.count({ where }),
    ]);

    return { customers, total, page };
  } catch {
    return { customers: [], total: 0, page: 1 };
  }
}

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const { customers, total, page } = await getCustomers(params);
  const totalPages = getTotalPages(total);

  return (
    <div className="grid gap-8">
      <AdminPageHeader
        eyebrow="Clients"
        title="Base clients"
        description="Consultez les clients enregistres automatiquement lors du checkout WhatsApp."
      />

      <Card>
        <CardHeader>
          <CardTitle>Liste des clients</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          <AdminSearchForm
            basePath="/admin/customers"
            defaultQuery={params.q}
            searchPlaceholder="Rechercher par nom, telephone ou ville..."
            filters={[
              {
                name: "type",
                label: "Type",
                defaultValue: params.type ?? "ALL",
                options: [
                  { value: "ALL", label: "Tous types" },
                  { value: "NORMAL", label: "Normal" },
                  { value: "WHOLESALE", label: "Wholesale" },
                ],
              },
            ]}
          />

          {customers.length > 0 ? (
            <>
              <div className="overflow-x-auto rounded-2xl border border-border">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-muted/50">
                    <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-3">Client</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Ville</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Commandes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer.id} className="border-t border-border">
                        <td className="px-4 py-4 font-black">{customer.name}</td>
                        <td className="px-4 py-4 text-muted-foreground">{customer.phone}</td>
                        <td className="px-4 py-4">{customer.city}</td>
                        <td className="px-4 py-4">
                          <Badge variant={customer.type === "WHOLESALE" ? "accent" : "outline"}>
                            {customer.type}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 font-semibold">{customer._count.orders}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <AdminPagination
                basePath="/admin/customers"
                page={page}
                totalPages={totalPages}
                params={{ q: params.q, type: params.type }}
              />
              <p className="text-sm text-muted-foreground">
                {total} client{total > 1 ? "s" : ""} · {ADMIN_PAGE_SIZE} par page
              </p>
            </>
          ) : (
            <AdminEmptyState
              icon={Users}
              title="Aucun client"
              description="Les clients seront enregistres automatiquement au checkout."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
