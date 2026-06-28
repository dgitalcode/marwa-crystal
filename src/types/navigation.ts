export type HeaderNavLink = {
  label: string;
  href: string;
  fixed?: boolean;
};

export type CollectionNavItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  isVisible: boolean;
  isFeatured: boolean;
  position: number;
  productCount: number;
  createdAt: string;
};
