import { NextResponse } from "next/server";

import { getProducts } from "@/lib/catalog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim().toLowerCase();

  if (!query) {
    return NextResponse.json([]);
  }

  const products = await getProducts();
  const results = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.collectionName.toLowerCase().includes(query),
    )
    .slice(0, 8)
    .map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: product.discountPrice ?? product.price,
      collectionName: product.collectionName,
    }));

  return NextResponse.json(results);
}
