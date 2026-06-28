import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";

export type DashboardOverview = {
  stats: {
    products: number;
    collections: number;
    orders: number;
    customers: number;
    reviews: number;
    revenue: number;
    pendingOrders: number;
    lowStockProducts: number;
  };
  salesByStatus: { status: string; count: number; total: number }[];
  recentOrders: {
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
  }[];
  recentReviews: {
    id: string;
    customerName: string;
    rating: number;
    content: string;
    createdAt: string;
  }[];
  recentStockMovements: {
    id: string;
    productName: string;
    quantity: number;
    reason: string;
    createdAt: string;
  }[];
};

const emptyOverview: DashboardOverview = {
  stats: {
    products: 0,
    collections: 0,
    orders: 0,
    customers: 0,
    reviews: 0,
    revenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
  },
  salesByStatus: [],
  recentOrders: [],
  recentReviews: [],
  recentStockMovements: [],
};

export async function getDashboardOverview(): Promise<DashboardOverview> {
  try {
    const [
      products,
      collections,
      orders,
      customers,
      reviews,
      revenueAgg,
      pendingOrders,
      lowStockProducts,
      salesGroups,
      recentOrders,
      recentReviews,
      recentStockMovements,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.collection.count(),
      prisma.order.count(),
      prisma.customer.count(),
      prisma.review.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: "CANCELLED" } },
      }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.product.count({ where: { stock: { lte: 5 }, status: "ACTIVE" } }),
      prisma.order.groupBy({
        by: ["status"],
        _count: { id: true },
        _sum: { total: true },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { customer: { select: { name: true } } },
      }),
      prisma.review.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          customerName: true,
          rating: true,
          content: true,
          createdAt: true,
        },
      }),
      prisma.stockMovement.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { product: { select: { name: true } } },
      }),
    ]);

    return {
      stats: {
        products,
        collections,
        orders,
        customers,
        reviews,
        revenue: revenueAgg._sum.total ?? 0,
        pendingOrders,
        lowStockProducts,
      },
      salesByStatus: salesGroups.map((group) => ({
        status: group.status,
        count: group._count.id,
        total: group._sum.total ?? 0,
      })),
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customer.name,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
      })),
      recentReviews: recentReviews.map((review) => ({
        id: review.id,
        customerName: review.customerName,
        rating: review.rating,
        content: review.content,
        createdAt: review.createdAt.toISOString(),
      })),
      recentStockMovements: recentStockMovements.map((movement) => ({
        id: movement.id,
        productName: movement.product.name,
        quantity: movement.quantity,
        reason: movement.reason,
        createdAt: movement.createdAt.toISOString(),
      })),
    };
  } catch {
    return emptyOverview;
  }
}

export function formatDashboardMoney(value: number) {
  return formatMoney(value);
}
