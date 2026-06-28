"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getPublishedReviews } from "@/lib/reviews";
import { prisma } from "@/lib/prisma";
import type { Review } from "@/types/review";

export type ReviewActionResult =
  | { success: true; message: string }
  | { success: false; error: string };

const submitReviewSchema = z.object({
  customerName: z.string().trim().min(2, "Le nom doit contenir au moins 2 caracteres."),
  content: z
    .string()
    .trim()
    .min(8, "L'avis doit contenir au moins 8 caracteres.")
    .max(500, "L'avis ne peut pas depasser 500 caracteres."),
  rating: z.coerce.number().int().min(1).max(5),
});

function validationErrorMessage(error: z.ZodError) {
  return error.issues[0]?.message ?? "Donnees invalides.";
}

export async function submitReview(formData: FormData): Promise<ReviewActionResult> {
  const parsed = submitReviewSchema.safeParse({
    customerName: formData.get("customerName"),
    content: formData.get("content"),
    rating: formData.get("rating"),
  });

  if (!parsed.success) {
    return { success: false, error: validationErrorMessage(parsed.error) };
  }

  try {
    await prisma.review.create({
      data: {
        customerName: parsed.data.customerName,
        content: parsed.data.content,
        rating: parsed.data.rating,
      },
    });

    revalidatePath("/");

    return {
      success: true,
      message: "Merci pour votre avis !",
    };
  } catch {
    return { success: false, error: "Impossible d'envoyer l'avis pour le moment." };
  }
}

export async function loadRemainingReviews(skip: number): Promise<Review[]> {
  return getPublishedReviews(undefined, skip);
}
