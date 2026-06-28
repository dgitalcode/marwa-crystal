"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export type ReviewActionResult =
  | { success: true }
  | { success: false; error: string };

function revalidateReviewPaths() {
  revalidatePath("/");
  revalidatePath("/admin/reviews");
}

export async function deleteReview(reviewId: string): Promise<ReviewActionResult> {
  await requireAdmin();

  try {
    await prisma.review.delete({
      where: { id: reviewId },
    });

    revalidateReviewPaths();
    return { success: true };
  } catch {
    return { success: false, error: "Impossible de supprimer l'avis." };
  }
}
