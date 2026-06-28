import { getStoreSettings } from "@/lib/store-settings";

import { SiteFooter } from "./site-footer";

export async function SiteFooterWrapper() {
  const branding = await getStoreSettings();
  return <SiteFooter branding={branding} />;
}
