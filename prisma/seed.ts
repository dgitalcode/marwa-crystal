import bcrypt from "bcryptjs";

import { defaultReviews } from "../src/data/default-reviews";
import { fallbackCollections, fallbackProducts } from "../src/data/fallback-catalog";
import { getDefaultStoreSettingsRecord } from "../src/lib/store-settings";
import { prisma } from "../src/lib/prisma";
import { STORE_SETTINGS_ID } from "../src/data/default-store-settings";
async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@marwacrystal.local";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "SUPER_ADMIN" },
    create: {
      email: adminEmail,
      name: "Marwa Crystal Admin",
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: "SUPER_ADMIN",
    },
  });

  await prisma.storeSettings.upsert({
    where: { id: STORE_SETTINGS_ID },
    update: {},
    create: getDefaultStoreSettingsRecord(),
  });

  const reviewCount = await prisma.review.count();
  if (reviewCount === 0) {
    await prisma.review.createMany({
      data: defaultReviews.map((review) => ({
        customerName: review.customerName,
        content: review.content,
        rating: review.rating,
      })),
    });
  }

  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();

  for (const [index, collection] of fallbackCollections.entries()) {
    await prisma.collection.create({
      data: {
        name: collection.name,
        slug: collection.slug,
        description: collection.description,
        heroImageUrl: collection.image,
        imageAlt: collection.name,
        isFeatured: true,
        isVisible: true,
        sortOrder: index,
      },
    });
  }

  for (const product of fallbackProducts) {
    const collection = await prisma.collection.findUniqueOrThrow({
      where: { slug: product.collectionSlug },
    });

    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description:
          "Piece premium selectionnee pour apporter une touche elegante et raffinee a votre interieur.",
        details:
          "Finition soignee, qualite premium, livraison partout au Maroc et paiement a la livraison.",
        price: product.price,
        discountPrice: product.discountPrice,
        wholesalePrice: product.wholesalePrice,
        wholesaleMinQty: product.wholesaleMinQty,
        stock: product.stock,
        sku: `MC-${product.id.toUpperCase()}`,
        badge: product.badge,
        status: "ACTIVE",
        isFeatured: true,
        collectionId: collection.id,
        images: {
          create: [
            {
              url: product.image,
              alt: product.name,
              sortOrder: 0,
            },
          ],
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
