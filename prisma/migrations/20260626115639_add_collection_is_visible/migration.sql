-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "isVisible" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Collection_isVisible_sortOrder_idx" ON "Collection"("isVisible", "sortOrder");
