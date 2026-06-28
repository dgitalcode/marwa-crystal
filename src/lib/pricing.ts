import type { CartItem, CustomerType } from "@/types/commerce";

export function getUnitPrice(item: CartItem, customerType: CustomerType) {
  if (
    customerType === "WHOLESALE" &&
    item.wholesalePrice &&
    item.wholesaleMinQty &&
    item.quantity >= item.wholesaleMinQty
  ) {
    return item.wholesalePrice;
  }

  return item.discountPrice ?? item.price;
}

export function getCartTotal(items: CartItem[], customerType: CustomerType) {
  return items.reduce(
    (total, item) => total + getUnitPrice(item, customerType) * item.quantity,
    0,
  );
}

export function getSavingsPercent(price: number, discountPrice: number | null) {
  if (!discountPrice || discountPrice >= price) {
    return null;
  }

  return Math.round(((price - discountPrice) / price) * 100);
}
