import { fallbackCollections } from "@/data/fallback-catalog";
import { prisma } from "@/lib/prisma";
import type { CollectionNavItem, HeaderNavLink } from "@/types/navigation";

export const FIXED_HEADER_LINKS = {
  allProducts: { label: "Toutes les pièces", href: "/collections" },
  wholesale: { label: "Wholesale", href: "/wholesale" },
  about: { label: "À propos", href: "/about" },
  contact: { label: "Contact", href: "/contact" },
} as const;

export function buildHeaderNavLinks(collectionLinks: HeaderNavLink[]): HeaderNavLink[] {
  return [
    { ...FIXED_HEADER_LINKS.allProducts, fixed: true },
    ...collectionLinks,
    { ...FIXED_HEADER_LINKS.wholesale, fixed: true },
    { ...FIXED_HEADER_LINKS.about, fixed: true },
    { ...FIXED_HEADER_LINKS.contact, fixed: true },
  ];
}

export async function getVisibleHeaderCollectionLinks(): Promise<HeaderNavLink[]> {
  try {
    const collections = await prisma.collection.findMany({
      where: { isVisible: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { name: true, slug: true },
    });

    return collections.map((collection) => ({
      label: collection.name,
      href: `/collections/${collection.slug}`,
    }));
  } catch {
    return fallbackCollections.map((collection) => ({
      label: collection.name,
      href: `/collections/${collection.slug}`,
    }));
  }
}

export async function getHeaderNavigationLinks(): Promise<HeaderNavLink[]> {
  const collectionLinks = await getVisibleHeaderCollectionLinks();
  return buildHeaderNavLinks(collectionLinks);
}

export async function getAdminCollectionNavItems(): Promise<CollectionNavItem[]> {
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
      image: collection.heroImageUrl,
      isVisible: collection.isVisible,
      isFeatured: collection.isFeatured,
      position: collection.sortOrder,
      productCount: collection._count.products,
      createdAt: collection.createdAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function getNextCollectionPosition() {
  const last = await prisma.collection.findFirst({
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  return (last?.sortOrder ?? -1) + 1;
}
