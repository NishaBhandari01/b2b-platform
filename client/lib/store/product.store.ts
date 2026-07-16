import { create } from "zustand";

interface ProductState {
  product: any;

  setProduct: (data: any) => void;

  updateProduct: (data: any) => void;

  reset: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
  product: {},

  setProduct: (data) =>
    set({
      product: data,
    }),

  updateProduct: (data) =>
    set((state) => ({
      product: {
        ...state.product,
        ...data,
      },
    })),

  reset: () =>
    set({
      product: {},
    }),
}));
