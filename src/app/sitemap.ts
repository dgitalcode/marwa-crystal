import type { MetadataRoute } from "next";

import { getCollections, getProducts } from "@/lib/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_STORE_URL ?? "http://localhost:3000";
  const [collections, products] = await Promise.all([getCollections(), getProducts()]);

  return [
    "",
    "/collections",
    "/about",
    "/contact",
    "/cart",
    "/checkout/whatsapp",
    ...collections.map((collection) => `/collections/${collection.slug}`),
    ...products.map((product) => `/products/${product.slug}`),
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));
}
