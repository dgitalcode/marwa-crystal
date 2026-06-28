import { CollectionCreateForm } from "@/components/admin/collection-create-form";
import { CollectionNavManager } from "@/components/admin/collection-nav-manager";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FIXED_HEADER_LINKS, getAdminCollectionNavItems } from "@/lib/navigation";

export default async function AdminCollectionsPage() {
  const collections = await getAdminCollectionNavItems();
  const fixedLinks = [
    FIXED_HEADER_LINKS.allProducts,
    FIXED_HEADER_LINKS.wholesale,
    FIXED_HEADER_LINKS.about,
    FIXED_HEADER_LINKS.contact,
  ];

  return (
    <div className="grid gap-8">
      <AdminPageHeader
        eyebrow="Navigation"
        title="Collections"
        description="Les liens fixes restent toujours visibles. Gerez les collections du header : visibilite, ordre et contenu."
      />

      <Card>
        <CardHeader>
          <CardTitle>Liens fixes (non modifiables)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {fixedLinks.map((link) => (
              <Badge key={link.href} variant="outline" className="px-3 py-1.5 text-xs">
                {link.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Nouvelle collection</CardTitle>
          </CardHeader>
          <CardContent>
            <CollectionCreateForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Collections du header</CardTitle>
          </CardHeader>
          <CardContent>
            <CollectionNavManager collections={collections} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
