import { useMutation } from "@tanstack/react-query";
import {
  createProductDraft,
  updateProductBasicInfo,
  uploadProductImage,
  deleteProductImage,
  publishProduct,
  BasicInfoPayload,
  MediaDetailsPayload,
} from "../api/product.api";

export function useCreateProductDraft() {
  return useMutation({
    mutationFn: (data: BasicInfoPayload) => createProductDraft(data),
  });
}

export function useUpdateProductBasicInfo() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: BasicInfoPayload }) =>
      updateProductBasicInfo(id, data),
  });
}

export function useUploadProductImage() {
  return useMutation({
    mutationFn: ({
      id,
      file,
      isPrimary,
      onProgress,
    }: {
      id: string;
      file: File;
      isPrimary: boolean;
      onProgress?: (pct: number) => void;
    }) => uploadProductImage(id, file, isPrimary, onProgress),
  });
}

export function useDeleteProductImage() {
  return useMutation({
    mutationFn: ({ id, imageId }: { id: string; imageId: string }) =>
      deleteProductImage(id, imageId),
  });
}

export function usePublishProduct() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MediaDetailsPayload }) =>
      publishProduct(id, data),
  });
}
