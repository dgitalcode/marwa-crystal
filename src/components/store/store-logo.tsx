import Link from "next/link";

import { StoreImage } from "@/components/store/store-image";
import type { StoreBranding } from "@/types/store-settings";

const textSizeClasses: Record<string, string> = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
};

type StoreLogoProps = {
  branding: StoreBranding;
  variant?: "header" | "footer";
  className?: string;
};

export function StoreLogo({ branding, variant = "header", className }: StoreLogoProps) {
  const width = variant === "footer" ? branding.footerLogoWidth : branding.logoWidth;
  const height = variant === "footer" ? branding.footerLogoHeight : branding.logoHeight;

  const content =
    branding.logoType === "IMAGE" && branding.logoImageUrl ? (
      <div className="relative" style={{ width, height }}>
        <StoreImage
          src={branding.logoImageUrl}
          alt={branding.logoText.replace("\n", " ")}
          fill
          className="object-contain object-left"
          sizes={`${width}px`}
          priority={variant === "header"}
        />
      </div>
    ) : (
      <TextLogo branding={branding} variant={variant} />
    );

  return (
    <Link href="/" className={className}>
      {content}
    </Link>
  );
}

function TextLogo({
  branding,
  variant,
}: {
  branding: StoreBranding;
  variant: "header" | "footer";
}) {
  const lines = branding.logoText.split("\n").filter(Boolean);
  const sizeClass = textSizeClasses[branding.logoSize] ?? "";
  const isNumericSize = /^\d+$/.test(branding.logoSize);
  const footerScale = variant === "footer" ? "scale-105" : "";

  return (
    <div className={footerScale}>
      {lines.map((line, index) => (
        <span
          key={`${line}-${index}`}
          className={`block uppercase leading-none tracking-[0.14em] ${sizeClass} ${
            index === 0 ? "" : "mt-0.5"
          }`}
          style={{
            color: branding.logoColor,
            fontWeight: Number(branding.logoFontWeight) || 900,
            fontSize: isNumericSize ? `${branding.logoSize}px` : undefined,
          }}
        >
          {line}
        </span>
      ))}
    </div>
  );
}
