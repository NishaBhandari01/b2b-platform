// import axios from "axios";
// import type { GetProductsResponse } from "@/types/product";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// export const createProduct = async (data: any) => {
//   const response = await axios.post(`${API_URL}/api/products`, data, {
//     withCredentials: true,
//   });

//   return response.data;
// };

// export const uploadFileApi = async (
//   file: File,
//   onProgress: (pct: number) => void,
// ) => {
//   const formData = new FormData();
//   formData.append("file", file);

//   const response = await axios.post(
//     `${API_URL}/api/products/upload`,
//     formData,
//     {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//       withCredentials: true,
//       onUploadProgress: (progressEvent) => {
//         if (progressEvent.total) {
//           const percentCompleted = Math.round(
//             (progressEvent.loaded * 100) / progressEvent.total,
//           );
//           onProgress(percentCompleted);
//         }
//       },
//     },
//   );

//   return response.data;
// };

// export const getMyProducts = async (params?: {
//   page?: number;
//   limit?: number;
//   search?: string;
//   category?: string;
//   status?: string;
//   sort?: string;
// }) => {
//   const response = await axios.get(`${API_URL}/api/products/my-products`, {
//     params,
//     withCredentials: true,
//   });

//   return response.data;
// };

// export const getProducts = async (): Promise<GetProductsResponse> => {
//   const response = await axios.get(`${API_URL}/api/products`, {
//     withCredentials: true,
//   });

//   return response.data;
// };

// export const getProductById = async (id: string) => {
//   const response = await axios.get(`${API_URL}/api/products/${id}`, {
//     withCredentials: true,
//   });

//   return response.data;
// };

// export const updateProduct = async (id: string, data: any) => {
//   const response = await axios.put(`${API_URL}/api/products/${id}`, data, {
//     withCredentials: true,
//   });

//   return response.data;
// };

// export const deleteProduct = async (id: string) => {
//   const response = await axios.delete(`${API_URL}/api/products/${id}`, {
//     withCredentials: true,
//   });

//   return response.data;
// };

import axios from "axios";
import type { RawProductsResponse, Product } from "@/types/product";
import { mapRawProduct } from "@/lib/mappers/product.mapper";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const createProduct = async (data: any) => {
  const response = await axios.post(`${API_URL}/api/products`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const uploadFileApi = async (
  file: File,
  onProgress: (pct: number) => void,
) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    `${API_URL}/api/products/upload`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          onProgress(
            Math.round((progressEvent.loaded * 100) / progressEvent.total),
          );
        }
      },
    },
  );
  return response.data;
};

/**
 * Logged-in supplier's own products — confirmed working via Swagger.
 * This is the endpoint the "My Products" page should use.
 */
export const getMyProducts = async (): Promise<{ data: Product[] }> => {
  const response = await axios.get<RawProductsResponse>(
    `${API_URL}/api/products/my-products`,
    { withCredentials: true },
  );
  return { data: response.data.data.map(mapRawProduct) };
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await axios.get<{ success: boolean; data: any }>(
    `${API_URL}/api/products/${id}`,
    { withCredentials: true },
  );
  return mapRawProduct(response.data.data);
};

export const updateProduct = async (id: string, data: any) => {
  const response = await axios.put(`${API_URL}/api/products/${id}`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await axios.delete(`${API_URL}/api/products/${id}`, {
    withCredentials: true,
  });
  return response.data;
};
