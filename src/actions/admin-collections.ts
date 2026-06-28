"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin-auth";
import { getNextCollectionPosition } from "@/lib/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export type CollectionActionResult =
  | { success: true }
  | { success: false; error: string };

function revalidateNavigationPaths() {
  revalidatePath("/");
  revalidatePath("/collections");
  revalidatePath("/admin/collections");
}

function emptyToUndefined(value: unknown) {
  return value === "" || value === null || value === undefined ? undefined : value;
}

const optionalPosition = z.preprocess(
  emptyToUndefined,
  z.coerce.number().int().min(0).optional(),
);

const createCollectionSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caracteres."),
  slug: z.preprocess(
    emptyToUndefined,
    z.string().min(2, "Le slug doit contenir au moins 2 caracteres.").optional(),
  ),
  description: z.string().min(3, "La description doit contenir au moins 3 caracteres."),
  heroImageUrl: z.preprocess(emptyToUndefined, z.string().optional()),
  position: optionalPosition,
});

const updateCollectionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caracteres."),
  slug: z.string().min(2, "Le slug doit contenir au moins 2 caracteres."),
  description: z.string().min(3, "La description doit contenir au moins 3 caracteres."),
  heroImageUrl: z.preprocess(emptyToUndefined, z.string().optional()),
  position: z.coerce.number().int().min(0),
});

function parseCollectionFormData(
  formData: FormData,
  fields: Array<keyof z.infer<typeof createCollectionSchema> | "id">,
) {
  return Object.fromEntries(fields.map((field) => [field, formData.get(field) ?? ""]));
}

function parseCheckbox(formData: FormData, name: string) {
  return formData.get(name) === "true";
}

function validationErrorMessage(error: z.ZodError) {
  const issue = error.issues[0];
  if (!issue) {
    return "Donnees invalides.";
  }

  const field = issue.path[0];
  if (typeof field === "string") {
    return `${field}: ${issue.message}`;
  }

  return issue.message;
}

export async function updateCollection(formData: FormData): Promise<CollectionActionResult> {
  await requireAdmin();
  const parsed = updateCollectionSchema.safeParse(
    parseCollectionFormData(formData, [
      "id",
      "name",
      "slug",
      "description",
      "heroImageUrl",
      "position",
    ]),
  );
  if (!parsed.success) {
    return { success: false, error: validationErrorMessage(parsed.error) };
  }
  const isVisible = parseCheckbox(formData, "isVisible");
  const isFeatured = parseCheckbox(formData, "isFeatured");

  try {
    await prisma.collection.update({
      where: { id: parsed.data.id },
      data: {
        name: parsed.data.name,
        slug: slugify(parsed.data.slug),
        description: parsed.data.description,
        heroImageUrl: parsed.data.heroImageUrl || null,
        imageAlt: parsed.data.name,
        isFeatured,
        isVisible,
        sortOrder: parsed.data.position,
      },
    });

    revalidateNavigationPaths();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Impossible de mettre a jour la collection.",
    };
  }
}

export async function createCollection(formData: FormData): Promise<CollectionActionResult> {
  await requireAdmin();
  const parsed = createCollectionSchema.safeParse(
    parseCollectionFormData(formData, [
      "name",
      "slug",
      "description",
      "heroImageUrl",
      "position",
    ]),
  );
  if (!parsed.success) {
    return { success: false, error: validationErrorMessage(parsed.error) };
  }
  const slug = parsed.data.slug?.trim()
    ? slugify(parsed.data.slug)
    : slugify(parsed.data.name);
  const position = parsed.data.position ?? (await getNextCollectionPosition());
  const isVisible = parseCheckbox(formData, "isVisible");
  const isFeatured = parseCheckbox(formData, "isFeatured");

  try {
    await prisma.collection.create({
      data: {
        name: parsed.data.name,
        slug,
        description: parsed.data.description,
        heroImageUrl: parsed.data.heroImageUrl || null,
        imageAlt: parsed.data.name,
        isFeatured,
        isVisible: formData.has("isVisible") ? isVisible : true,
        sortOrder: position,
      },
    });

    revalidateNavigationPaths();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Impossible de creer la collection.",
    };
  }
}

export async function toggleCollectionVisibility(collectionId: string) {
  await requireAdmin();
  const collection = await prisma.collection.findUniqueOrThrow({
    where: { id: collectionId },
    select: { isVisible: true },
  });

  await prisma.collection.update({
    where: { id: collectionId },
    data: { isVisible: !collection.isVisible },
  });

  revalidateNavigationPaths();
}

export async function deleteCollection(collectionId: string) {
  await requireAdmin();

  const collection = await prisma.collection.findUniqueOrThrow({
    where: { id: collectionId },
    include: { _count: { select: { products: true } } },
  });

  if (collection._count.products > 0) {
    throw new Error("Impossible de supprimer une collection qui contient des produits.");
  }

  await prisma.collection.delete({
    where: { id: collectionId },
  });

  revalidateNavigationPaths();
}
