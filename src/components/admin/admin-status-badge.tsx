import { Badge } from "@/components/ui/badge";

const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  CONTACTED: "Contacte",
  CONFIRMED: "Confirmee",
  FULFILLED: "Livree",
  CANCELLED: "Annulee",
};

const PRODUCT_STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Actif",
  DRAFT: "Brouillon",
  ARCHIVED: "Archive",
};

export function OrderStatusBadge({ status }: { status: string }) {
  const variant =
    status === "FULFILLED"
      ? "accent"
      : status === "CANCELLED"
        ? "danger"
        : status === "PENDING"
          ? "outline"
          : "default";

  return <Badge variant={variant}>{ORDER_STATUS_LABELS[status] ?? status}</Badge>;
}

export function ProductStatusBadge({ status }: { status: string }) {
  const variant =
    status === "ACTIVE" ? "accent" : status === "ARCHIVED" ? "danger" : "outline";

  return <Badge variant={variant}>{PRODUCT_STATUS_LABELS[status] ?? status}</Badge>;
}
