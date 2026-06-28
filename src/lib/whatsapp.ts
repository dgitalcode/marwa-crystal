import { getCartTotal, getUnitPrice } from "@/lib/pricing";
import { formatMoney } from "@/lib/utils";
import type { CartItem, CheckoutCustomer } from "@/types/commerce";

export function buildWhatsAppOrderMessage(
  items: CartItem[],
  customer: CheckoutCustomer,
  orderNumber?: string,
) {
  const total = getCartTotal(items, customer.customerType);
  const lines = items
    .map((item) => {
      const unitPrice = getUnitPrice(item, customer.customerType);
      const wholesale =
        customer.customerType === "WHOLESALE" &&
        item.wholesaleMinQty &&
        item.quantity >= item.wholesaleMinQty
          ? " (prix wholesale)"
          : "";

      return `- ${item.name}${wholesale}\n  Quantite: ${item.quantity}\n  Prix: ${formatMoney(unitPrice)}\n  Total ligne: ${formatMoney(unitPrice * item.quantity)}`;
    })
    .join("\n\n");

  return [
    "Bonjour Marwa Crystal,",
    "",
    "Je souhaite confirmer cette commande:",
    orderNumber ? `Reference: ${orderNumber}` : null,
    `Type client: ${customer.customerType === "WHOLESALE" ? "Wholesale" : "Normal"}`,
    "",
    lines,
    "",
    `Total commande: ${formatMoney(total)}`,
    "",
    "Informations client:",
    `Nom: ${customer.name}`,
    `Telephone: ${customer.phone}`,
    `Ville: ${customer.city}`,
    `Adresse: ${customer.address}`,
    customer.note ? `Note: ${customer.note}` : null,
    "",
    "Merci de me confirmer la disponibilite et la livraison.",
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildWhatsAppUrl(message: string) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "212704460891";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export type WholesaleQuoteInput = {
  name: string;
  company?: string;
  phone: string;
  whatsapp?: string;
  city: string;
  message?: string;
  quantity: string;
};

export function buildWholesaleQuoteMessage(input: WholesaleQuoteInput) {
  const contactWhatsApp = input.whatsapp?.trim() || input.phone;

  return [
    "Bonjour Marwa Crystal,",
    "",
    "Je souhaite obtenir un devis *WHOLESALE / B2B*.",
    "",
    "*Informations professionnelles*",
    `Nom: ${input.name}`,
    input.company ? `Entreprise: ${input.company}` : null,
    `Telephone: ${input.phone}`,
    `WhatsApp: ${contactWhatsApp}`,
    `Ville: ${input.city}`,
    `Quantite souhaitee: ${input.quantity}`,
    input.message ? `Message: ${input.message}` : null,
    "",
    "Merci de me confirmer les prix professionnels, disponibilites et delais de livraison.",
  ]
    .filter(Boolean)
    .join("\n");
}
