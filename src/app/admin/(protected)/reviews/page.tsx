import { MessageSquareQuote } from "lucide-react";

import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ReviewManager } from "@/components/admin/review-manager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminReviews } from "@/lib/reviews";

export default async function AdminReviewsPage() {
  const reviews = await getAdminReviews();

  return (
    <div className="grid gap-8">
      <AdminPageHeader
        eyebrow="Reputation"
        title="Avis clients"
        description="Consultez les avis publies sur la boutique et supprimez ceux qui ne conviennent pas."
      />

      <Card>
        <CardHeader>
          <CardTitle>Avis publies ({reviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length > 0 ? (
            <ReviewManager reviews={reviews} />
          ) : (
            <AdminEmptyState
              icon={MessageSquareQuote}
              title="Aucun avis"
              description="Les avis laisses par les clients apparaitront ici."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
