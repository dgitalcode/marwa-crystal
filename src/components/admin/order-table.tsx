"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { updateOrderStatus } from "@/actions/admin-orders";
import { OrderStatusBadge } from "@/components/admin/admin-status-badge";
import { Select } from "@/components/ui/select";
import { formatMoney } from "@/lib/utils";
import type { OrderStatus } from "@/generated/prisma";

export type AdminOrderRow = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  customerType: string;
  total: number;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    city: string;
    email: string | null;
  };
  items: {
    id: string;
    productName: string;
    quantity: number;
    lineTotal: number;
  }[];
};

const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONTACTED",
  "CONFIRMED",
  "FULFILLED",
  "CANCELLED",
];

function formatDate(value: string) {
  return new Date(value).toLocaleString("fr-MA", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function OrderTable({ orders }: { orders: AdminOrderRow[] }) {
  return (
    <div className="grid gap-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

function OrderCard({ order }: { order: AdminOrderRow }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-black">{order.orderNumber}</h3>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
          <div className="mt-4 grid gap-1 text-sm">
            <p>
              <span className="font-semibold">Client:</span> {order.customer.name}
            </p>
            <p>
              <span className="font-semibold">Telephone:</span> {order.customer.phone}
            </p>
            <p>
              <span className="font-semibold">Ville:</span> {order.customer.city}
            </p>
            {order.customer.email ? (
              <p>
                <span className="font-semibold">Email:</span> {order.customer.email}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 lg:w-72">
          <p className="text-2xl font-black">{formatMoney(order.total)}</p>
          <Select
            defaultValue={order.status}
            disabled={isPending}
            onChange={(event) => {
              const status = event.target.value as OrderStatus;
              startTransition(async () => {
                const result = await updateOrderStatus(order.id, status);
                if (result.success) {
                  toast.success(result.message);
                  router.refresh();
                  return;
                }
                toast.error(result.error);
              });
            }}
          >
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="mt-5 rounded-xl border border-border bg-background p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Details</p>
        <div className="mt-3 grid gap-2 text-sm">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between gap-4">
              <span>
                {item.quantity} x {item.productName}
              </span>
              <span className="font-semibold">{formatMoney(item.lineTotal)}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
