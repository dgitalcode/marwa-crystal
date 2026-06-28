export type CustomerType = "NORMAL" | "WHOLESALE";

export type ProductSummary = {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  wholesalePrice: number | null;
  wholesaleMinQty: number | null;
  stock: number;
  badge: string | null;
  image: string;
  collectionSlug: string;
  collectionName: string;
};

export type CollectionSummary = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  discountPrice: number | null;
  wholesalePrice: number | null;
  wholesaleMinQty: number | null;
  quantity: number;
};

export type CheckoutCustomer = {
  name: string;
  phone: string;
  city: string;
  address: string;
  note?: string;
  customerType: CustomerType;
};
