// import axios from "axios";
import type { RawProductsResponse } from "@/types/product";
import { mapRawProduct } from "@/lib/mappers/product.mapper";
import axios from "axios";
import { ProductDetail } from "@/types/product-detail";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export type PriceType = "fixed" | "range" | "rfq";
export type ProductStatus = "draft" | "active" | "out_of_stock" | "archived";

export interface ProductImage {
  id: string;
  url: string;
  publicId: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface Product {
  id: string;
  supplierId: string;
  name: string;
  slug: string;
  category: string;
  subCategory?: string | null;
  brand?: string | null;
  modelNumber?: string | null;
  sku?: string | null;
  status: ProductStatus;
  shortDescription?: string | null;
  description: string;
  keyFeatures?: string[] | null;
  applications?: string[] | null;
  benefits?: string[] | null;
  priceType: PriceType;
  currency: string;
  price?: string | null;
  minPrice?: string | null;
  maxPrice?: string | null;
  unit: string;
  minOrderQty?: number | null;
  moqUnit?: string | null;
  availableQuantity?: number | null;
  stockUnit?: string | null;
  specifications?: Record<string, string> | null;
  shippingInfo?: Record<string, string> | null;
  certifications?: string[] | null;
  tags: string[];
  keywords: string[];
  images: ProductImage[];
}

export interface BasicInfoPayload {
  name: string;
  category: string;
  subCategory?: string;
  brand?: string;
  modelNumber?: string;
  sku?: string;
  shortDescription?: string;
  description: string;
  // priceType: PriceType;
  // currency: string;
  price?: number;
  minPrice?: number;
  maxPrice?: number;
  // unit: string;
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

export const createProductDraft = async (data: BasicInfoPayload) => {
  const response = await axios.post(`${API_URL}/api/products`, data, {
    withCredentials: true,
  });
  return response.data;
};

// export const updateProductBasicInfo = async (
//   id: string,
//   data: BasicInfoPayload,
// ) => {
//   const response = await axios.patch(`${API_URL}/api/products/${id}`, data, {
//     withCredentials: true,
//   });
//   return response.data;
// };

// export const getMyProducts = async (id: string) => {
//   const response = await axios.get(`${API_URL}/api/products/${id}`, {
//     withCredentials: true,
//   });
//   return response.data;
// };
export const getMyProducts = async (): Promise<{ data: Product[] }> => {
  const response = await axios.get<RawProductsResponse>(
    `${API_URL}/api/products/my-products`,
    {
      withCredentials: true,
    },
  );

  return {
    data: response.data.data.map(mapRawProduct),
  };
};

// export const getProductById = async (id: string): Promise<Product> => {
//   const response = await axios.get<{ success: boolean; data: any }>(
//     `${API_URL}/api/products/${id}`,
//     {
//       withCredentials: true,
//     },
//   );

//   return mapRawProduct(response.data.data);
// };

export const getProductById = async (id: string): Promise<ProductDetail> => {
  const response = await axios.get<{
    success: boolean;
    data: ProductDetail;
  }>(`${API_URL}/api/products/${id}`, {
    withCredentials: true,
  });

  return response.data.data;
};

// export const getMyProducts = async (): Promise<{ data: Product[] }> => {
//   const response = await axios.get<RawProductsResponse>(
//     `${API_URL}/api/products/my-products`,
//     { withCredentials: true },
//   );
//   return { data: response.data.data.map(mapRawProduct) };
// };

export const uploadProductImage = async (
  id: string,
  file: File,
  isPrimary: boolean,
  onProgress?: (pct: number) => void,
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("isPrimary", String(isPrimary));

  const response = await axios.post(
    `${API_URL}/api/products/${id}/images`,
    formData,
    {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (evt) => {
        if (onProgress && evt.total) {
          onProgress(Math.round((evt.loaded * 100) / evt.total));
        }
      },
    },
  );
  return response.data;
};

export const deleteProductImage = async (id: string, imageId: string) => {
  const response = await axios.delete(
    `${API_URL}/api/products/${id}/images/${imageId}`,
    { withCredentials: true },
  );
  return response.data;
};

export const publishProduct = async (id: string, data: MediaDetailsPayload) => {
  const response = await axios.post(
    `${API_URL}/api/products/${id}/publish`,
    data,
    { withCredentials: true },
  );
  return response.data;
};

export const updateProductBasicInfo = async (
  id: string,
  data: BasicInfoPayload,
) => {
  const response = await axios.patch(`${API_URL}/api/products/${id}`, data, {
    withCredentials: true,
  });

  return response.data;
};
