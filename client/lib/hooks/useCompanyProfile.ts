// lib/hooks/useCompanyProfile.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCompanyProfile,
  createCompanyProfile,
  updateCompanyProfile,
  uploadCompanyDocument,
  UpdateCompanyPayload,
} from "../api/company.api";

const COMPANY_PROFILE_KEY = ["company", "profile"];

export function useCompanyProfile() {
  return useQuery({
    queryKey: COMPANY_PROFILE_KEY,
    queryFn: async () => {
      const res = await getCompanyProfile();
      return res.data;
    },
    staleTime: 60 * 1000,
    retry: false, // a 404 means "no profile yet", not a transient failure
  });
}

export function useCreateCompanyProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string } & Partial<UpdateCompanyPayload>) =>
      createCompanyProfile(payload),
    onSuccess: (res) => {
      queryClient.setQueryData(COMPANY_PROFILE_KEY, res.data);
    },
  });
}

export function useUpdateCompanyProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateCompanyPayload) =>
      updateCompanyProfile(payload),
    onSuccess: (res) => {
      queryClient.setQueryData(COMPANY_PROFILE_KEY, res.data);
    },
  });
}

// This must call uploadCompanyDocument (multipart POST to /documents/upload),
// never updateCompanyProfile. If your previous version of this hook called
// updateCompanyProfile here, that was the bug — replace this file wholesale.
export function useUploadCompanyDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      name,
      file,
      onProgress,
    }: {
      name: string;
      file: File;
      onProgress?: (pct: number) => void;
    }) => uploadCompanyDocument(name, file, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANY_PROFILE_KEY });
    },
  });
}
