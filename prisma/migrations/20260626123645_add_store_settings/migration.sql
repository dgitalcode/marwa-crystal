-- CreateEnum
CREATE TYPE "LogoType" AS ENUM ('TEXT', 'IMAGE');

-- CreateTable
CREATE TABLE "StoreSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "logoType" "LogoType" NOT NULL DEFAULT 'TEXT',
    "logoText" TEXT NOT NULL DEFAULT 'Marwa
Crystal',
    "logoImageUrl" TEXT,
    "logoColor" TEXT NOT NULL DEFAULT '#c9a227',
    "logoSize" TEXT NOT NULL DEFAULT '2xl',
    "logoFontWeight" TEXT NOT NULL DEFAULT '900',
    "logoWidth" INTEGER NOT NULL DEFAULT 160,
    "logoHeight" INTEGER NOT NULL DEFAULT 48,
    "footerLogoWidth" INTEGER NOT NULL DEFAULT 180,
    "footerLogoHeight" INTEGER NOT NULL DEFAULT 56,
    "footerDescription" TEXT NOT NULL,
    "footerLinks" JSONB NOT NULL,
    "socialLinks" JSONB NOT NULL,
    "contactInfo" JSONB NOT NULL,
    "copyrightText" TEXT NOT NULL,
    "announcementText" TEXT NOT NULL,
    "announcementEnabled" BOOLEAN NOT NULL DEFAULT true,
    "announcementStyle" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreSettings_pkey" PRIMARY KEY ("id")
);
