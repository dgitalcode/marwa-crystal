import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function AdminStatCard({
  label,
  value,
  hint,
  icon: Icon,
  href,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  href?: string;
  tone?: "default" | "accent" | "warning";
}) {
  const content = (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-sm transition duration-300",
        href && "hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md",
        tone === "accent" && "border-accent/25 bg-accent/5",
        tone === "warning" && "border-destructive/20 bg-destructive/5",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-black">{value}</p>
          {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        <div
          className={cn(
            "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-muted",
            tone === "accent" && "bg-accent/15 text-accent",
            tone === "warning" && "bg-destructive/10 text-destructive",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
