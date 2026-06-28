import type { FooterLink } from "@/types/store-settings";

export const FIXED_FOOTER_LINKS: FooterLink[] = [
  { label: "Collections", href: "/collections" },
  { label: "A propos", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Wholesale", href: "/wholesale" },
];

export const FIXED_SOCIAL_PLATFORMS = [
  { key: "facebook", label: "Facebook" },
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
  { key: "whatsapp", label: "WhatsApp" },
] as const;

export type SocialPlatformKey = (typeof FIXED_SOCIAL_PLATFORMS)[number]["key"];
