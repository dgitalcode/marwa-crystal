import { getHeaderNavigationLinks } from "@/lib/navigation";
import { getStoreSettings } from "@/lib/store-settings";

import { SiteHeader } from "./site-header";

export async function SiteHeaderWrapper() {
  const [navLinks, branding] = await Promise.all([
    getHeaderNavigationLinks(),
    getStoreSettings(),
  ]);

  return <SiteHeader navLinks={navLinks} branding={branding} />;
}
