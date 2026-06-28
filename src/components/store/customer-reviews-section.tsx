import { ReviewSubmitForm } from "@/components/store/review-submit-form";
import { ReviewsGrid } from "@/components/store/reviews-grid";
import { StarRating } from "@/components/store/star-rating";
import { getPublishedReviews, getReviewStats, HOMEPAGE_REVIEWS_LIMIT } from "@/lib/reviews";

export async function CustomerReviewsSection() {
  const [reviews, stats] = await Promise.all([
    getPublishedReviews(HOMEPAGE_REVIEWS_LIMIT),
    getReviewStats(),
  ]);

  if (reviews.length === 0) {
    return (
      <section className="overflow-x-hidden bg-muted/35 px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-accent sm:text-sm sm:tracking-[0.24em]">
              Avis clients
            </p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Soyez le premier a laisser un avis
            </h2>
          </div>
          <div className="mx-auto mt-8 max-w-xl sm:mt-10">
            <ReviewSubmitForm />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-x-hidden bg-muted/35 px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-10">
          <div className="min-w-0">
            <div className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-accent sm:text-sm sm:tracking-[0.24em]">
                  Avis clients
                </p>
                <h2 className="mt-2 text-3xl font-black sm:text-4xl">Ce que disent nos clients</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                  Des avis authentiques sur la qualite, la livraison et le service Marwa Crystal.
                </p>
              </div>
              <div className="w-full shrink-0 rounded-2xl border border-border bg-card px-5 py-4 text-center shadow-sm sm:w-auto">
                <p className="text-3xl font-black text-accent">{stats.average.toFixed(1)}</p>
                <StarRating rating={Math.round(stats.average)} className="mt-2 justify-center" />
                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  {stats.count} avis
                </p>
              </div>
            </div>

            <ReviewsGrid
              key={`${stats.count}-${reviews[0]?.id ?? ""}`}
              initialReviews={reviews}
              totalCount={stats.count}
            />
          </div>

          <div className="min-w-0 lg:sticky lg:top-24">
            <ReviewSubmitForm />
          </div>
        </div>
      </div>
    </section>
  );
}
