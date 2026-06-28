import { StoreSettingsEditor } from "@/components/admin/store-settings-editor";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getStoreSettings } from "@/lib/store-settings";

export default async function AdminStoreSettingsPage() {
  const settings = await getStoreSettings();

  return (
    <div className="grid gap-8">
      <AdminPageHeader
        eyebrow="Boutique"
        title="Parametres du store"
        description="Personnalisez le logo, le footer, la banniere promotionnelle et les liens sociaux."
      />
      <StoreSettingsEditor settings={settings} />
    </div>
  );
}
