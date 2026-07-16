import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createProduct } from "@/lib/api/product.api";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,

    onSuccess: (data) => {
      console.log("Product created:", data);

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },

    onError: (error: any) => {
      console.log("Create product error:", error.response?.data);
    },
  });
};
