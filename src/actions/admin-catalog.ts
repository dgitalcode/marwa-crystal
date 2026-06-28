"use server";

import { ProductStatus } from "@/generated/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export type CatalogActionResult =
  | { success: true; message?: string }
  | { success: false; error: string };

const optionalPositiveInt = z.preprocess(
  (value) => (value === "" || value === null ? undefined : value),
  z.coerce.number().int().positive().optional(),
);

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  details: z.string().optional(),
  collectionId: z.string().min(1),
  price: z.coerce.number().int().positive(),
  discountPrice: optionalPositiveInt,
  wholesalePrice: optionalPositiveInt,
  wholesaleMinQty: optionalPositiveInt,
  stock: z.coerce.number().int().min(0),
  badge: z.string().optional(),
  status: z.nativeEnum(ProductStatus),
  imageUrls: z.string().min(5),
});

const updateProductSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caracteres."),
  description: z.string().trim().min(10, "Description trop courte."),
  price: z.coerce.number().int().positive(),
  discountPrice: optionalPositiveInt,
  stock: z.coerce.number().int().min(0),
  badge: z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.string().trim().optional(),
  ),
  status: z.nativeEnum(ProductStatus),
});

function revalidateCatalogPaths() {
  revalidatePath("/admin/products");
  revalidatePath("/admin/stock");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/collections");
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const parsed = productSchema.parse(Object.fromEntries(formData));
  const slug = slugify(parsed.name);
  const imageUrls = parsed.imageUrls
    .split(/\r?\n/)
    .map((url) => url.trim())
    .filter(Boolean);

  await prisma.product.create({
    data: {
      name: parsed.name,
      slug,
      description: parsed.description,
      details: parsed.details || null,
      collectionId: parsed.collectionId,
      price: parsed.price,
      discountPrice: parsed.discountPrice ?? null,
      wholesalePrice: parsed.wholesalePrice ?? null,
      wholesaleMinQty: parsed.wholesaleMinQty ?? null,
      stock: parsed.stock,
      badge: parsed.badge || null,
      status: parsed.status,
      isFeatured: parsed.status === ProductStatus.ACTIVE,
      images: {
        create: imageUrls.map((url, index) => ({
          url,
          alt: parsed.name,
          sortOrder: index,
        })),
      },
    },
  });

  revalidateCatalogPaths();
}

export async function updateProductStock(productId: string, formData: FormData) {
  await requireAdmin();
  const stock = z.coerce.number().int().min(0).parse(formData.get("stock"));

  await prisma.product.update({
    where: { id: productId },
    data: {
      stock,
      stockMovements: {
        create: {
          quantity: stock,
          reason: "Manual admin stock update",
        },
      },
    },
  });

  revalidateCatalogPaths();
}

export async function updateProduct(
  productId: string,
  formData: FormData,
): Promise<CatalogActionResult> {
  await requireAdmin();

  const parsed = updateProductSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Donnees invalides." };
  }

  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        name: parsed.data.name,
        slug: slugify(parsed.data.name),
        description: parsed.data.description,
        price: parsed.data.price,
        discountPrice: parsed.data.discountPrice ?? null,
        stock: parsed.data.stock,
        badge: parsed.data.badge ?? null,
        status: parsed.data.status,
        isFeatured: parsed.data.status === ProductStatus.ACTIVE,
      },
    });

    revalidateCatalogPaths();
    return { success: true, message: "Produit mis a jour." };
  } catch {
    return { success: false, error: "Impossible de mettre a jour le produit." };
  }
}

export async function deleteProduct(productId: string): Promise<CatalogActionResult> {
  await requireAdmin();

  try {
    const linkedOrders = await prisma.orderItem.count({ where: { productId } });

    if (linkedOrders > 0) {
      await prisma.product.update({
        where: { id: productId },
        data: { status: ProductStatus.ARCHIVED, isFeatured: false },
      });
      revalidateCatalogPaths();
      return { success: true, message: "Produit archive (commandes existantes)." };
    }

    await prisma.product.delete({ where: { id: productId } });
    revalidateCatalogPaths();
    return { success: true, message: "Produit supprime." };
  } catch {
    return { success: false, error: "Impossible de supprimer le produit." };
  }
}
