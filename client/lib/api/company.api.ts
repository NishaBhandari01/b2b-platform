import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface CompanyDocument {
  id: string;
  name: string;
  url: string;
  status: string;
}

export interface Certification {
  id: string;
  name: string;
}

export interface Branch {
  id: string;
  label: string;
  location: string;
}

export interface CompanyProfile {
  id: string;
  userId: string;
  name: string;
  gstNumber?: string | null;
  panNumber?: string | null;
  established?: string | null;
  employees?: string | null;
  description?: string | null;
  verified: boolean;
  verifiedAt?: string | null;
  documents: CompanyDocument[];
  certifications: Certification[];
  branches: Branch[];
}

export interface UpdateCompanyPayload {
  name?: string;
  gstNumber?: string;
  panNumber?: string;
  established?: string;
  employees?: string;
  description?: string;
}

export const getCompanyProfile = async (): Promise<{
  success: boolean;
  data: CompanyProfile;
}> => {
  const response = await axios.get(`${API_URL}/api/company/profile`, {
    withCredentials: true,
  });
  return response.data;
};

export const createCompanyProfile = async (
  data: { name: string } & Partial<UpdateCompanyPayload>,
) => {
  const response = await axios.post(`${API_URL}/api/company/profile`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const updateCompanyProfile = async (data: UpdateCompanyPayload) => {
  const response = await axios.put(`${API_URL}/api/company/profile`, data, {
    withCredentials: true,
  });
  return response.data;
};

// IMPORTANT: this hits /api/company/documents/upload — NOT /api/company/profile.
// If a document upload ever comes back with message "Company profile updated
// successfully", something is calling updateCompanyProfile instead of this
// function. This function only ever does a multipart POST to the upload route.
export const uploadCompanyDocument = async (
  name: string,
  file: File,
  onProgress?: (pct: number) => void,
) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("file", file);

  const response = await axios.post(
    `${API_URL}/api/company/documents/upload`,
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
