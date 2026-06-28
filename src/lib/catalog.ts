import { fallbackCollections, fallbackProducts } from "@/data/fallback-catalog";
import { prisma } from "@/lib/prisma";
import type { CollectionSummary, ProductSummary } from "@/types/commerce";

function productImage(product: {
  images: { url: string }[];
}) {
  return product.images[0]?.url ?? fallbackProducts[0].image;
}

export async function getCollections(): Promise<CollectionSummary[]> {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: { _count: { select: { products: true } } },
    });

    return collections.map((collection) => ({
      id: collection.id,
      name: collection.name,
      slug: collection.slug,
      description: collection.description,
      image: collection.heroImageUrl ?? fallbackCollections[0].image,
      productCount: collection._count.products,
    }));
  } catch {
    return fallbackCollections;
  }
}

export type ProductSort = "featured" | "newest" | "price-asc" | "price-desc" | "name";

export async function getProducts(options?: {
  collectionSlug?: string;
  featured?: boolean;
  sort?: ProductSort;
  inStockOnly?: boolean;
  onSaleOnly?: boolean;
}): Promise<ProductSummary[]> {
  const sort = options?.sort ?? "featured";

  try {
    const orderBy =
      sort === "newest"
        ? [{ createdAt: "desc" as const }]
        : sort === "price-asc"
          ? [{ price: "asc" as const }]
          : sort === "price-desc"
            ? [{ price: "desc" as const }]
            : sort === "name"
              ? [{ name: "asc" as const }]
              : [{ isFeatured: "desc" as const }, { createdAt: "desc" as const }];

    const products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        isFeatured: options?.featured,
        stock: options?.inStockOnly ? { gt: 0 } : undefined,
        discountPrice: options?.onSaleOnly ? { not: null } : undefined,
        collection: options?.collectionSlug
          ? { slug: options.collectionSlug }
          : undefined,
      },
      orderBy,
      include: {
        collection: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
    });

    let mapped = products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      discountPrice: product.discountPrice,
      wholesalePrice: product.wholesalePrice,
      wholesaleMinQty: product.wholesaleMinQty,
      stock: product.stock,
      badge: product.badge,
      image: productImage(product),
      collectionSlug: product.collection.slug,
      collectionName: product.collection.name,
    }));

    if (sort === "price-asc" || sort === "price-desc") {
      mapped = mapped.sort((a, b) => {
        const priceA = a.discountPrice ?? a.price;
        const priceB = b.discountPrice ?? b.price;
        return sort === "price-asc" ? priceA - priceB : priceB - priceA;
      });
    }

    return mapped;
  } catch {
    let filtered = options?.collectionSlug
      ? fallbackProducts.filter((product) => product.collectionSlug === options.collectionSlug)
      : fallbackProducts;

    if (options?.featured) {
      filtered = filtered.slice(0, 4);
    }
    if (options?.inStockOnly) {
      filtered = filtered.filter((product) => product.stock > 0);
    }
    if (options?.onSaleOnly) {
      filtered = filtered.filter((product) => product.discountPrice != null);
    }

    const sorted = [...filtered];
    switch (sort) {
      case "price-asc":
        sorted.sort(
          (a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price),
        );
        break;
      case "price-desc":
        sorted.sort(
          (a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price),
        );
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name, "fr"));
        break;
      case "newest":
        sorted.reverse();
        break;
      default:
        break;
    }

    return sorted;
  }
}

export async function getWholesaleProducts(limit = 6): Promise<ProductSummary[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        wholesalePrice: { not: null },
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: limit,
      include: {
        collection: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      discountPrice: product.discountPrice,
      wholesalePrice: product.wholesalePrice,
      wholesaleMinQty: product.wholesaleMinQty,
      stock: product.stock,
      badge: product.badge,
      image: productImage(product),
      collectionSlug: product.collection.slug,
      collectionName: product.collection.name,
    }));
  } catch {
    return fallbackProducts
      .filter((product) => product.wholesalePrice != null)
      .slice(0, limit);
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        collection: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!product) {
      const fallback = fallbackProducts.find((entry) => entry.slug === slug);
      return fallback
        ? {
            ...fallback,
            description:
              "Accessoire premium selectionne pour sa finition elegante, son confort et sa capacite a signer une tenue.",
            details:
              "Finition doree, cristaux brillants, livraison partout au Maroc et paiement a la livraison.",
            images: [fallback.image],
          }
        : null;
    }

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      details: product.details,
      price: product.price,
      discountPrice: product.discountPrice,
      wholesalePrice: product.wholesalePrice,
      wholesaleMinQty: product.wholesaleMinQty,
      stock: product.stock,
      badge: product.badge,
      images: product.images.length
        ? product.images.map((image) => image.url)
        : [fallbackProducts[0].image],
      collectionSlug: product.collection.slug,
      collectionName: product.collection.name,
    };
  } catch {
    const product = fallbackProducts.find((entry) => entry.slug === slug);
    if (!product) {
      return null;
    }
    return {
      ...product,
      description:
        "Accessoire premium selectionne pour sa finition elegante, son confort et sa capacite a signer une tenue.",
      details:
        "Finition doree, cristaux brillants, livraison partout au Maroc et paiement a la livraison.",
      images: [product.image],
    };
  }
}
