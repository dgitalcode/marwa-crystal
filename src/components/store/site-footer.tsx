import Link from "next/link";
import { MapPin, Phone } from "lucide-react";

import { StoreLogo } from "@/components/store/store-logo";
import { SocialIcon } from "@/components/store/social-icons";
import { FIXED_FOOTER_LINKS, FIXED_SOCIAL_PLATFORMS } from "@/lib/store-branding-constants";
import type { StoreBranding } from "@/types/store-settings";

export function SiteFooter({ branding }: { branding: StoreBranding }) {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <StoreLogo branding={branding} variant="footer" className="inline-block" />
          <p className="mt-5 max-w-md text-sm leading-7 text-primary-foreground/70">
            {branding.footerDescription}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-wide">Boutique</h3>
          <div className="mt-4 grid gap-3 text-sm text-primary-foreground/70">
            {FIXED_FOOTER_LINKS.map((link) => (
              <Link key={`${link.label}-${link.href}`} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-wide">Nous contacter</h3>
          <div className="mt-4 grid gap-3 text-sm text-primary-foreground/70">
            <span className="flex gap-2">
              <Phone className="h-4 w-4 text-accent" />
              {branding.contactInfo.phone}
            </span>
            <span className="flex gap-2">
              <MapPin className="h-4 w-4 text-accent" />
              {branding.contactInfo.address}
            </span>
            <span>{branding.contactInfo.hours}</span>
            {branding.contactInfo.email ? (
              <span>{branding.contactInfo.email}</span>
            ) : null}
          </div>
          <div className="mt-5 flex flex-wrap gap-2.5 sm:gap-3">
            {FIXED_SOCIAL_PLATFORMS.map((platform) => (
              <a
                key={platform.key}
                href={branding.socialUrls[platform.key]}
                target="_blank"
                rel="noreferrer"
                aria-label={platform.label}
                title={platform.label}
                className="grid h-10 w-10 place-items-center rounded-full border border-primary-foreground/15 bg-primary-foreground/5 text-primary-foreground transition duration-300 hover:border-accent hover:bg-accent/10 hover:text-accent sm:h-11 sm:w-11"
              >
                <SocialIcon platform={platform.key} className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 px-4 py-5 text-center text-xs text-primary-foreground/60">
        {branding.copyrightText}
      </div>
    </footer>
  );
}
