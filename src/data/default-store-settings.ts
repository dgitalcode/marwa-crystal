import type {
  AnnouncementStyle,
  ContactInfo,
  SocialUrls,
  StoreBranding,
} from "@/types/store-settings";

export const STORE_SETTINGS_ID = "default";

export const defaultSocialUrls: SocialUrls = {
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  tiktok: "https://tiktok.com",
  whatsapp: "https://wa.me/212704460891",
};

export const defaultContactInfo: ContactInfo = {
  phone: "+212 7 04 46 08 91",
  address: "Casablanca, Maroc",
  hours: "Lun - Sam: 9h00 - 19h00",
  email: "marwacrystal1@gmail.com",
};

export const defaultAnnouncementStyle: AnnouncementStyle = {
  backgroundColor: "#171412",
  textColor: "#fffaf3",
};

export const defaultStoreBranding: Omit<StoreBranding, "id" | "updatedAt"> = {
  logoType: "TEXT",
  logoText: "Marwa\nCrystal",
  logoImageUrl: null,
  logoColor: "#c9a227",
  logoSize: "2xl",
  logoFontWeight: "900",
  logoWidth: 160,
  logoHeight: 48,
  footerLogoWidth: 180,
  footerLogoHeight: 56,
  footerDescription:
    "Boutique premium d'accessoires avec paiement a la livraison et confirmation rapide via WhatsApp.",
  socialUrls: defaultSocialUrls,
  contactInfo: defaultContactInfo,
  copyrightText: "© 2026 Marwa Crystal. Tous droits reserves.",
  announcementText: "Livraison COD partout au Maroc | Commande via WhatsApp",
  announcementEnabled: true,
  announcementStyle: defaultAnnouncementStyle,
};
