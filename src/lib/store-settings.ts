import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import type { Prisma } from "@/generated/prisma";
import {
  deleteCloudinaryImage,
  extractCloudinaryPublicId,
  isCloudinaryConfigured,
  uploadImageToCloudinary,
} from "@/lib/cloudinary";
import {
  defaultAnnouncementStyle,
  defaultContactInfo,
  defaultSocialUrls,
  defaultStoreBranding,
  STORE_SETTINGS_ID,
} from "@/data/default-store-settings";
import { prisma } from "@/lib/prisma";
import type {
  AnnouncementStyle,
  ContactInfo,
  SocialUrls,
  StoreBranding,
} from "@/types/store-settings";

function parseJsonObject<T extends Record<string, unknown>>(
  value: unknown,
  fallback: T,
): T {
  return value && typeof value === "object" && !Array.isArray(value)
    ? ({ ...fallback, ...(value as T) } as T)
    : fallback;
}

function parseSocialUrls(value: unknown): SocialUrls {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return parseJsonObject<SocialUrls>(value, defaultSocialUrls);
  }

  if (Array.isArray(value)) {
    const urls = { ...defaultSocialUrls };
    for (const item of value) {
      if (!item || typeof item !== "object") {
        continue;
      }

      const platform = (item as { platform?: string }).platform;
      const url = (item as { url?: string }).url;
      if (
        platform &&
        url &&
        (platform === "facebook" ||
          platform === "instagram" ||
          platform === "tiktok" ||
          platform === "whatsapp")
      ) {
        urls[platform] = url;
      }
    }

    return urls;
  }

  return defaultSocialUrls;
}

function mapStoreSettings(record: {
  id: string;
  logoType: "TEXT" | "IMAGE";
  logoText: string;
  logoImageUrl: string | null;
  logoColor: string;
  logoSize: string;
  logoFontWeight: string;
  logoWidth: number;
  logoHeight: number;
  footerLogoWidth: number;
  footerLogoHeight: number;
  footerDescription: string;
  socialUrls: unknown;
  contactInfo: unknown;
  copyrightText: string;
  announcementText: string;
  announcementEnabled: boolean;
  announcementStyle: unknown;
  updatedAt: Date;
}): StoreBranding {
  return {
    id: record.id,
    logoType: record.logoType,
    logoText: record.logoText,
    logoImageUrl: record.logoImageUrl,
    logoColor: record.logoColor,
    logoSize: record.logoSize,
    logoFontWeight: record.logoFontWeight,
    logoWidth: record.logoWidth,
    logoHeight: record.logoHeight,
    footerLogoWidth: record.footerLogoWidth,
    footerLogoHeight: record.footerLogoHeight,
    footerDescription: record.footerDescription,
    socialUrls: parseSocialUrls(record.socialUrls),
    contactInfo: parseJsonObject<ContactInfo>(record.contactInfo, defaultContactInfo),
    copyrightText: record.copyrightText,
    announcementText: record.announcementText,
    announcementEnabled: record.announcementEnabled,
    announcementStyle: parseJsonObject<AnnouncementStyle>(
      record.announcementStyle,
      defaultAnnouncementStyle,
    ),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export function getDefaultStoreSettingsRecord(): Prisma.StoreSettingsCreateInput {
  return {
    id: STORE_SETTINGS_ID,
    logoType: defaultStoreBranding.logoType,
    logoText: defaultStoreBranding.logoText,
    logoImageUrl: defaultStoreBranding.logoImageUrl,
    logoColor: defaultStoreBranding.logoColor,
    logoSize: defaultStoreBranding.logoSize,
    logoFontWeight: defaultStoreBranding.logoFontWeight,
    logoWidth: defaultStoreBranding.logoWidth,
    logoHeight: defaultStoreBranding.logoHeight,
    footerLogoWidth: defaultStoreBranding.footerLogoWidth,
    footerLogoHeight: defaultStoreBranding.footerLogoHeight,
    footerDescription: defaultStoreBranding.footerDescription,
    socialUrls: defaultStoreBranding.socialUrls,
    contactInfo: defaultStoreBranding.contactInfo,
    copyrightText: defaultStoreBranding.copyrightText,
    announcementText: defaultStoreBranding.announcementText,
    announcementEnabled: defaultStoreBranding.announcementEnabled,
    announcementStyle: defaultStoreBranding.announcementStyle,
  };
}

export async function getStoreSettings(): Promise<StoreBranding> {
  try {
    const settings = await prisma.storeSettings.findUnique({
      where: { id: STORE_SETTINGS_ID },
    });

    if (settings) {
      return mapStoreSettings(settings);
    }

    const created = await prisma.storeSettings.create({
      data: getDefaultStoreSettingsRecord(),
    });

    return mapStoreSettings(created);
  } catch {
    return {
      id: STORE_SETTINGS_ID,
      ...defaultStoreBranding,
      updatedAt: new Date().toISOString(),
    };
  }
}

const ALLOWED_LOGO_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml"]);
const MAX_LOGO_SIZE = 2 * 1024 * 1024;

export async function saveUploadedLogoFile(file: File) {
  if (!ALLOWED_LOGO_TYPES.has(file.type)) {
    throw new Error("Format non supporte. Utilisez JPG, PNG, WEBP ou SVG.");
  }

  if (file.size > MAX_LOGO_SIZE) {
    throw new Error("Le fichier depasse la taille maximale de 2 Mo.");
  }

  if (isCloudinaryConfigured()) {
    const uploaded = await uploadImageToCloudinary(file, "marwa-crystal/logos");
    return uploaded.url;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "Cloudinary est requis en production. Configurez CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET.",
    );
  }

  const extensionMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/svg+xml": "svg",
  };

  const extension = extensionMap[file.type] ?? "png";
  const brandingDir = path.join(process.cwd(), "public", "images", "branding");
  await mkdir(brandingDir, { recursive: true });

  const filename = `logo.${extension}`;
  const absolutePath = path.join(brandingDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, buffer);

  return `/images/branding/${filename}?v=${Date.now()}`;
}

export async function deleteLocalLogoFile(logoImageUrl: string | null | undefined) {
  if (!logoImageUrl) {
    return;
  }

  const publicId = extractCloudinaryPublicId(logoImageUrl);
  if (publicId) {
    await deleteCloudinaryImage(publicId);
    return;
  }

  if (!logoImageUrl.startsWith("/images/branding/")) {
    return;
  }

  const pathname = logoImageUrl.split("?")[0] ?? logoImageUrl;
  const absolutePath = path.join(process.cwd(), "public", pathname);

  try {
    await unlink(absolutePath);
  } catch {
    // File may already be removed.
  }
}
