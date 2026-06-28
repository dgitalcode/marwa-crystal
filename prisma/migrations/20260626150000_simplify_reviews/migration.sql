-- Rename column
ALTER TABLE "Review" RENAME COLUMN "authorName" TO "customerName";

-- Drop old index
DROP INDEX IF EXISTS "Review_status_createdAt_idx";

-- Drop approval workflow columns
ALTER TABLE "Review" DROP COLUMN IF EXISTS "status";
ALTER TABLE "Review" DROP COLUMN IF EXISTS "isDefault";
ALTER TABLE "Review" DROP COLUMN IF EXISTS "updatedAt";

-- Drop enum
DROP TYPE IF EXISTS "ReviewStatus";

-- New index
CREATE INDEX "Review_createdAt_idx" ON "Review"("createdAt");
