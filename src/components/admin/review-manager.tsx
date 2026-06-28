"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteReview } from "@/actions/admin-reviews";
import { StarRating } from "@/components/store/star-rating";
import { Button } from "@/components/ui/button";
import type { Review } from "@/types/review";

export function ReviewManager({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Aucun avis pour le moment.</p>
    );
  }

  return (
    <div className="grid gap-4">
      {reviews.map((review) => (
        <ReviewManagerCard key={review.id} review={review} />
      ))}
    </div>
  );
}

function ReviewManagerCard({ review }: { review: Review }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-black">{review.customerName}</p>
          <StarRating rating={review.rating} size="sm" className="mt-2" />
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{review.content}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {new Date(review.createdAt).toLocaleString("fr-MA")}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={isPending}
          onClick={() => {
            if (!window.confirm("Supprimer cet avis ?")) {
              return;
            }

            startTransition(async () => {
              const result = await deleteReview(review.id);
              if (result.success) {
                toast.success("Avis supprime.");
                return;
              }
              toast.error(result.error);
            });
          }}
          aria-label="Supprimer"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
