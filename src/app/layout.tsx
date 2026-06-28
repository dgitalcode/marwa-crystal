import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";

import { Providers } from "@/components/providers";
import { SiteFooterWrapper } from "@/components/store/site-footer-wrapper";
import { SiteHeaderWrapper } from "@/components/store/site-header-wrapper";
import { WhatsAppFloating } from "@/components/store/whatsapp-floating";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Marwa Crystal | Premium Accessories",
    template: "%s | Marwa Crystal",
  },
  description:
    "Boutique premium d'accessoires avec commande WhatsApp, paiement a la livraison et options wholesale.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_STORE_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "Marwa Crystal",
    description: "Accessoires premium avec commande WhatsApp et COD.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${playfair.variable} antialiased`}>
        <Providers>
          <SiteHeaderWrapper />
          <main>{children}</main>
          <SiteFooterWrapper />
          <WhatsAppFloating />
          <Toaster richColors position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
