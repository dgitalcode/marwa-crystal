import { prisma } from "@/lib/prisma";
import type { Review } from "@/types/review";

export const HOMEPAGE_REVIEWS_LIMIT = 9;

function mapReview(review: {
  id: string;
  customerName: string;
  content: string;
  rating: number;
  createdAt: Date;
}): Review {
  return {
    id: review.id,
    customerName: review.customerName,
    content: review.content,
    rating: review.rating,
    createdAt: review.createdAt.toISOString(),
  };
}

export async function getPublishedReviews(limit?: number, skip = 0) {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: [{ createdAt: "desc" }],
      ...(limit !== undefined ? { take: limit } : {}),
      skip,
      select: {
        id: true,
        customerName: true,
        content: true,
        rating: true,
        createdAt: true,
      },
    });

    return reviews.map(mapReview);
  } catch {
    return [];
  }
}

export async function getReviewStats() {
  try {
    const result = await prisma.review.aggregate({
      _count: { id: true },
      _avg: { rating: true },
    });

    if (result._count.id === 0) {
      return { average: 0, count: 0 };
    }

    return {
      average: Math.round((result._avg.rating ?? 0) * 10) / 10,
      count: result._count.id,
    };
  } catch {
    return { average: 0, count: 0 };
  }
}

export async function getAdminReviews() {
  return getPublishedReviews(200);
}
