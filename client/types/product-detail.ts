export interface ProductImage {
  id: string;
  url: string;
  publicId: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface ProductDetail {
  id: string;

  name: string;
  slug: string;

  category: string;
  subCategory: string | null;

  brand: string | null;
  modelNumber: string | null;
  sku: string | null;

  status: string;

  shortDescription: string | null;
  description: string;

  keyFeatures: string[];

  priceType: string;

  currency: string;

  price: string | null;
  minPrice: string | null;
  maxPrice: string | null;

  unit: string;

  minOrderQty: number;

  moqUnit: string | null;

  availableQuantity: number;

  stockUnit: string | null;

  specifications: Record<string, string> | null;

  shippingInfo: Record<string, string> | null;

  certifications: string[];

  tags: string[];

  views: number;

  images: ProductImage[];

  createdAt: string;

  updatedAt: string;
}
