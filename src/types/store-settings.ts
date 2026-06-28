export type FooterLink = {
  label: string;
  href: string;
};

export type SocialUrls = {
  facebook: string;
  instagram: string;
  tiktok: string;
  whatsapp: string;
};

export type ContactInfo = {
  phone: string;
  address: string;
  hours: string;
  email?: string;
};

export type AnnouncementStyle = {
  backgroundColor: string;
  textColor: string;
};

export type StoreBranding = {
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
  socialUrls: SocialUrls;
  contactInfo: ContactInfo;
  copyrightText: string;
  announcementText: string;
  announcementEnabled: boolean;
  announcementStyle: AnnouncementStyle;
  updatedAt: string;
};
