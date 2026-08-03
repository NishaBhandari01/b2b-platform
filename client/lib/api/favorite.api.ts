import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface FavoriteCompany {
  id: string;
  name: string;
  industry?: string | null;
  description?: string | null;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  headquarters?: string | null;
}

export interface FavoriteSupplier {
  id: string;
  createdAt: string;
  company: FavoriteCompany;
}

// GET /api/favorites
export const getFavoriteSuppliers = async (): Promise<{
  success: boolean;
  data: FavoriteSupplier[];
}> => {
  const response = await axios.get(`${API_URL}/api/favorites`, {
    withCredentials: true,
  });

  return response.data;
};

// POST /api/favorites/:companyId
export const addFavoriteSupplier = async (companyId: string) => {
  const response = await axios.post(
    `${API_URL}/api/favorites/${companyId}`,
    {},
    {
      withCredentials: true,
    },
  );

  return response.data;
};

// DELETE /api/favorites/:companyId
export const removeFavoriteSupplier = async (companyId: string) => {
  const response = await axios.delete(`${API_URL}/api/favorites/${companyId}`, {
    withCredentials: true,
  });

  return response.data;
};
