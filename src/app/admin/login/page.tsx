import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/auth";
import { LoginForm } from "@/components/admin/login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isAdminRole } from "@/lib/admin-auth";

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions);
  if (isAdminRole(session?.user?.role)) {
    redirect("/admin");
  }

  return (
    <section className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4 py-16">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Connexion admin</CardTitle>
          <p className="text-sm text-muted-foreground">
            Acces protege pour gerer les collections, produits, commandes et stock.
          </p>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </section>
  );
}
