import { z } from "zod";

export const productSchema = z
  .object({
    name: z.string().min(3, "Product name minimum 3 characters"),

    category: z.string().min(2, "Category required"),

    sku: z.string().min(2, "SKU required"),

    brand: z.string().optional(),

    modelNumber: z.string().optional(),

    shortDescription: z.string().min(10),

    description: z.string().min(20),

    currency: z.string(),

    priceType: z.enum(["fixed", "range"]),

    price: z.coerce.number().min(0),

    minPrice: z.coerce.number().min(0),

    maxPrice: z.coerce.number().min(0),

    unit: z.string(),

    minOrderQty: z.coerce.number().int().min(1),

    availableQuantity: z.coerce.number().int().min(0),
  })
  .superRefine((data, ctx) => {
    if (data.priceType === "range" && data.minPrice > data.maxPrice) {
      ctx.addIssue({
        code: "custom",

        message: "Minimum price cannot exceed maximum price",

        path: ["minPrice"],
      });
    }

    if (data.minOrderQty > data.availableQuantity) {
      ctx.addIssue({
        code: "custom",

        message: "MOQ cannot exceed stock",

        path: ["minOrderQty"],
      });
    }
  });
