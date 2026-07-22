export type ApiProductStatus =
  | "active"
  | "draft"
  | "pending_approval"
  | "out_of_stock";

export type PriceType = "fixed" | "range" | "quote";

export interface ProductImage {
  url: string;
  isPrimary: boolean;
}

export interface RawProduct {
  id: string;
  name: string;

  category: string;
  subCategory?: string | null;

  sku?: string | null;

  status: ApiProductStatus | string;

  shortDescription?: string | null;
  description: string;

  priceType: PriceType | string;

  currency: string;

  price: string | null;
  minPrice: string | null;
  maxPrice: string | null;

  unit: string;

  minOrderQty: number;
  moqUnit?: string | null;

  availableQuantity: number;

  tags: string[];

  views?: number;

  updatedAt: string;

  shippingInfo?: {
    countryOfOrigin?: string;
  } | null;

  images: ProductImage[];
}

export interface RawProductsResponse {
  success: boolean;
  data: RawProduct[];
}

// ============================
// UI Product Model
// ============================

export type ProductStatus =
  | "Active"
  | "Draft"
  | "Pending Approval"
  | "Out of Stock";

export interface Product {
  id: string;

  name: string;

  category: string;

  description: string;

  image: string | null;

  status: ProductStatus;

  price: string;

  moq: string;

  sku: string;

  stock: number;

  location: string;

  updatedAt: string;

  rating: number;

  reviews: number;

  views: number;

  rfqs: number;

  inquiries: number;

  clicks: number;

  conversion: number;

  tags: string[];

  featuredTag?: "Best Seller" | "Most Viewed" | "Most RFQs";
}

// ============================
// API Payloads
// ============================

export interface BasicInfoPayload {
  name: string;

  category: string;

  subCategory?: string;

  brand?: string;

  modelNumber?: string;

  sku?: string;

  shortDescription?: string;

  description: string;

  priceType: PriceType;

  currency: string;

  price?: number;

  minPrice?: number;

  maxPrice?: number;

  unit: string;

  minOrderQty?: number;

  moqUnit?: string;

  availableQuantity?: number;

  stockUnit?: string;

  tags?: string[];

  keywords?: string[];
}

export interface MediaDetailsPayload {
  keyFeatures?: string[];

  specifications?: Record<string, string>;

  shippingInfo?: Record<string, string>;

  certifications?: string[];
}
