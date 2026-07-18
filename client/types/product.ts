// export type ProductStatus =
//   | "Active"
//   | "Draft"
//   | "Pending Approval"
//   | "Out of Stock";

// export interface Product {
//   id: string;
//   name: string;
//   category: string;
//   description: string;
//   image: string;
//   status: ProductStatus;
//   price: string;
//   moq: string;
//   sku: string;
//   stock: number;
//   location: string;
//   updatedAt: string;
//   rating: number;
//   reviews: number;
//   views: number;
//   rfqs: number;
//   inquiries: number;
//   clicks: number;
//   conversion: number;
//   tags: string[];
//   featuredTag?: "Best Seller" | "Most Viewed" | "Most RFQs";
// }

// export interface GetProductsResponse {
//   data: Product[];
//   total?: number;
//   page?: number;
// }

// What the backend actually returns
export interface RawProduct {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  sku: string;
  status: "active" | "draft" | "pending_approval" | "out_of_stock" | string;
  shortDescription: string;
  description: string;
  priceType: "fixed" | "range" | "quote" | string;
  currency: string;
  price: string | null;
  minPrice: string | null;
  maxPrice: string | null;
  unit: string;
  minOrderQty: number;
  moqUnit: string;
  availableQuantity: number;
  tags: string[];
  views: number;
  updatedAt: string;
  shippingInfo?: { countryOfOrigin?: string } | null;
  images: { url: string; isPrimary: boolean }[];
}

export interface RawProductsResponse {
  success: boolean;
  data: RawProduct[];
}

// What the UI components expect
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
  image: string | null; // changed
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
