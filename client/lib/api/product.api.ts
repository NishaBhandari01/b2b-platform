import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createProduct = async (data: any) => {
  const response = await axios.post(`${API_URL}/api/products`, data, {
    withCredentials: true,
  });

  return response.data;
};
