import { Warehouse } from "lucide-react";

import { updateProductStock } from "@/actions/admin-catalog";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProductStatusBadge } from "@/components/admin/admin-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";

async function getProducts() {
  try {
    return await prisma.product.findMany({
      orderBy: [{ stock: "asc" }, { name: "asc" }],
      include: { collection: true },
    });
  } catch {
    return [];
  }
}

export default async function AdminStockPage() {
  const products = await getProducts();
  const lowStockCount = products.filter((product) => product.stock <= 5).length;

  return (
    <div className="grid gap-8">
      <AdminPageHeader
        eyebrow="Inventaire"
        title="Gestion du stock"
        description={`Suivez les niveaux de stock et mettez a jour les quantites. ${lowStockCount} produit(s) en alerte.`}
      />

      <Card>
        <CardHeader>
          <CardTitle>Inventaire produits</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length > 0 ? (
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-muted/50">
                  <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3">Produit</th>
                    <th className="px-4 py-3">Collection</th>
                    <th className="px-4 py-3">Statut</th>
                    <th className="px-4 py-3">Alerte</th>
                    <th className="px-4 py-3">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-t border-border align-middle">
                      <td className="px-4 py-4 font-black">{product.name}</td>
                      <td className="px-4 py-4 text-muted-foreground">{product.collection.name}</td>
                      <td className="px-4 py-4">
                        <ProductStatusBadge status={product.status} />
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={product.stock <= 5 ? "danger" : "outline"}>
                          {product.stock <= 5 ? "Stock faible" : "OK"}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <form
                          action={updateProductStock.bind(null, product.id)}
                          className="flex items-center gap-2"
                        >
                          <Input
                            name="stock"
                            type="number"
                            defaultValue={product.stock}
                            className="h-9 w-24"
                          />
                          <Button type="submit" size="sm" variant="outline">
                            Mettre a jour
                          </Button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <AdminEmptyState
              icon={Warehouse}
              title="Aucun produit en stock"
              description="Ajoutez des produits pour suivre votre inventaire."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
