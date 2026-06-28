"use client";

import { ChevronDown, Quote } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import { loadRemainingReviews } from "@/actions/reviews";
import { StarRating } from "@/components/store/star-rating";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Review } from "@/types/review";

function ReviewCard({
  review,
  animateIn = false,
  animationDelay = 0,
}: {
  review: Review;
  animateIn?: boolean;
  animationDelay?: number;
}) {
  const [visible, setVisible] = useState(!animateIn);

  useEffect(() => {
    if (!animateIn) {
      return;
    }

    const timer = window.setTimeout(() => setVisible(true), animationDelay);
    return () => window.clearTimeout(timer);
  }, [animateIn, animationDelay]);

  return (
    <article
      className={cn(
        "group flex h-full w-full min-w-0 flex-col rounded-[1.75rem] border border-border bg-card p-5 shadow-sm transition duration-500 ease-out hover:-translate-y-1 hover:shadow-md sm:p-6",
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
      )}
      style={animateIn ? { transitionDelay: `${animationDelay}ms` } : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="break-words font-black leading-snug">{review.customerName}</p>
          <StarRating rating={review.rating} size="sm" className="mt-2" />
        </div>
        <Quote className="h-5 w-5 shrink-0 text-accent/70 transition group-hover:text-accent" />
      </div>
      <p className="mt-4 break-words text-sm leading-7 text-muted-foreground">
        {review.content}
      </p>
    </article>
  );
}

export function ReviewsGrid({
  initialReviews,
  totalCount,
}: {
  initialReviews: Review[];
  totalCount: number;
}) {
  const [reviews, setReviews] = useState(initialReviews);
  const [expanded, setExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();

  const hasMore = !expanded && totalCount > initialReviews.length;

  function handleExpand() {
    startTransition(async () => {
      const remaining = await loadRemainingReviews(initialReviews.length);
      setReviews((current) => [...current, ...remaining]);
      setExpanded(true);
    });
  }

  return (
    <div className="min-w-0">
      <div
        className={cn(
          "mt-6 grid grid-cols-1 gap-4 transition-[grid-template-rows] duration-500 ease-out sm:mt-8 sm:gap-5 md:grid-cols-2 xl:grid-cols-3",
        )}
      >
        {reviews.map((review, index) => (
          <ReviewCard
            key={review.id}
            review={review}
            animateIn={expanded && index >= initialReviews.length}
            animationDelay={(index - initialReviews.length) * 60}
          />
        ))}
      </div>

      {hasMore ? (
        <div className="mt-6 flex justify-center sm:mt-8">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={handleExpand}
            className="w-full max-w-xs gap-2 rounded-full px-8 transition duration-300 hover:-translate-y-0.5 sm:w-auto sm:max-w-none"
          >
            {isPending ? "Chargement..." : "Voir plus"}
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 transition-transform duration-300",
                isPending && "animate-pulse",
              )}
            />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
