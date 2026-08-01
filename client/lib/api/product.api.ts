import type {
  RawProductsResponse,
  Product,
  BasicInfoPayload,
  MediaDetailsPayload,
} from "@/types/product";
import { mapRawProduct } from "@/lib/mappers/product.mapper";
import axios from "axios";
import { ProductDetail } from "@/types/product-detail";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const createProductDraft = async (data: BasicInfoPayload) => {
  const response = await axios.post(`${API_URL}/api/products`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const getMyProducts = async (): Promise<{ data: Product[] }> => {
  const response = await axios.get<RawProductsResponse>(
    `${API_URL}/api/products/my-products`,
    { withCredentials: true },
  );

  return {
    data: response.data.data.map(mapRawProduct),
  };
};

export const getProductById = async (id: string): Promise<ProductDetail> => {
  const response = await axios.get<{
    success: boolean;
    data: ProductDetail;
  }>(`${API_URL}/api/products/${id}`, {
    withCredentials: true,
  });

  return response.data.data;
};

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

export const deleteProduct = async (productId: string) => {
  const response = await axios.delete(`${API_URL}/api/products/${productId}`, {
    withCredentials: true,
  });

  return response.data;
};
