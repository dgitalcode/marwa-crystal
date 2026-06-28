"use server";

import { CustomerType } from "@/generated/prisma";
import { z } from "zod";

import { getCartTotal, getUnitPrice } from "@/lib/pricing";
import { prisma } from "@/lib/prisma";
import { buildWhatsAppOrderMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import type { CartItem, CheckoutCustomer } from "@/types/commerce";

const cartItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  name: z.string(),
  image: z.string(),
  price: z.number().int().positive(),
  discountPrice: z.number().int().positive().nullable(),
  wholesalePrice: z.number().int().positive().nullable(),
  wholesaleMinQty: z.number().int().positive().nullable(),
  quantity: z.number().int().positive(),
});

const checkoutSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  city: z.string().min(2),
  address: z.string().min(4),
  note: z.string().optional(),
  customerType: z.nativeEnum(CustomerType),
  items: z.array(cartItemSchema).min(1),
});

function orderNumber() {
  return `MC-${Date.now().toString(36).toUpperCase()}`;
}

export async function createWhatsAppOrder(payload: unknown) {
  const parsed = checkoutSchema.parse(payload);
  const customer: CheckoutCustomer = {
    name: parsed.name,
    phone: parsed.phone,
    city: parsed.city,
    address: parsed.address,
    note: parsed.note,
    customerType: parsed.customerType,
  };
  const items: CartItem[] = parsed.items;
  const number = orderNumber();
  const message = buildWhatsAppOrderMessage(items, customer, number);
  const total = getCartTotal(items, parsed.customerType);

  try {
    const savedCustomer = await prisma.customer.upsert({
      where: { phone: parsed.phone },
      update: {
        name: parsed.name,
        city: parsed.city,
        address: parsed.address,
        type: parsed.customerType,
      },
      create: {
        name: parsed.name,
        phone: parsed.phone,
        city: parsed.city,
        address: parsed.address,
        type: parsed.customerType,
      },
    });

    await prisma.order.create({
      data: {
        orderNumber: number,
        customerId: savedCustomer.id,
        customerType: parsed.customerType,
        subtotal: total,
        total,
        note: parsed.note,
        whatsappText: message,
        items: {
          create: items.map((item) => {
            const unitPrice = getUnitPrice(item, parsed.customerType);
            const isWholesale =
              parsed.customerType === "WHOLESALE" &&
              Boolean(item.wholesaleMinQty && item.quantity >= item.wholesaleMinQty);

            return {
              productId: item.productId,
              productName: item.name,
              productSlug: item.slug,
              quantity: item.quantity,
              unitPrice,
              lineTotal: unitPrice * item.quantity,
              isWholesale,
            };
          }),
        },
      },
    });
  } catch {
    // WhatsApp remains the source of confirmation if the database is unavailable.
  }

  return {
    orderNumber: number,
    whatsappUrl: buildWhatsAppUrl(message),
  };
}
