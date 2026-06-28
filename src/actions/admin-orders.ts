"use server";

import { OrderStatus } from "@/generated/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export type OrderActionResult =
  | { success: true; message?: string }
  | { success: false; error: string };

function revalidateOrderPaths() {
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<OrderActionResult> {
  await requireAdmin();

  const parsed = z.nativeEnum(OrderStatus).safeParse(status);
  if (!parsed.success) {
    return { success: false, error: "Statut invalide." };
  }

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: parsed.data },
    });

    revalidateOrderPaths();
    return { success: true, message: "Statut mis a jour." };
  } catch {
    return { success: false, error: "Impossible de mettre a jour la commande." };
  }
}
