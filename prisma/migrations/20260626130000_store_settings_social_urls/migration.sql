-- AlterTable
ALTER TABLE "StoreSettings" ADD COLUMN "socialUrls" JSONB;

UPDATE "StoreSettings"
SET "socialUrls" = jsonb_build_object(
  'facebook', COALESCE(
    (
      SELECT value->>'url'
      FROM jsonb_array_elements("socialLinks") AS value
      WHERE value->>'platform' = 'facebook'
      LIMIT 1
    ),
    'https://facebook.com'
  ),
  'instagram', COALESCE(
    (
      SELECT value->>'url'
      FROM jsonb_array_elements("socialLinks") AS value
      WHERE value->>'platform' = 'instagram'
      LIMIT 1
    ),
    'https://instagram.com'
  ),
  'tiktok', COALESCE(
    (
      SELECT value->>'url'
      FROM jsonb_array_elements("socialLinks") AS value
      WHERE value->>'platform' = 'tiktok'
      LIMIT 1
    ),
    'https://tiktok.com'
  ),
  'whatsapp', COALESCE(
    (
      SELECT value->>'url'
      FROM jsonb_array_elements("socialLinks") AS value
      WHERE value->>'platform' = 'whatsapp'
      LIMIT 1
    ),
    'https://wa.me/212600000000'
  )
);

ALTER TABLE "StoreSettings" ALTER COLUMN "socialUrls" SET NOT NULL;

ALTER TABLE "StoreSettings" DROP COLUMN "footerLinks";
ALTER TABLE "StoreSettings" DROP COLUMN "socialLinks";
