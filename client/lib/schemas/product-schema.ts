import { z } from "zod";

/* ------------------------------------------------------------------ */
/*  Shared enums                                                       */
/* ------------------------------------------------------------------ */

export const PRODUCT_STATUS = ["draft", "active", "out_of_stock"] as const;
export const PRICE_TYPE = ["fixed", "range", "rfq"] as const;
export const CURRENCIES = ["USD", "EUR", "GBP", "INR", "AED", "CNY"] as const;
export const CERTIFICATIONS = [
  "ISO 9001",
  "ISO 14001",
  "CE",
  "FDA",
  "RoHS",
  "GMP",
  "BIS",
  "OHSAS 18001",
  "REACH",
] as const;
export const DELIVERY_TERMS = [
  "EXW",
  "FOB",
  "CIF",
  "CFR",
  "DDP",
  "DAP",
  "FCA",
] as const;

/* ------------------------------------------------------------------ */
/*  File-ish types (client only — files live in RHF state, not in the  */
/*  zod-validated payload, since File objects can't be serialized to   */
/*  drafts/localStorage safely)                                        */
/* ------------------------------------------------------------------ */

export interface UploadedImage {
  id: string;
  file?: File;
  url: string; // object URL for previews, or a remote URL once uploaded
  name: string;
  size: number;
  progress: number; // 0-100
  status: "uploading" | "done" | "error";
}

export interface UploadedDocument {
  id: string;
  file?: File;
  name: string;
  size: number;
  progress: number;
  status: "uploading" | "done" | "error";
}

/* ------------------------------------------------------------------ */
/*  Step 1 — Basic Information                                         */
/* ------------------------------------------------------------------ */

export const step1Schema = z.object({
  productName: z
    .string()
    .min(3, "Product name must be at least 3 characters")
    .max(120, "Product name must be under 120 characters"),
  category: z.string().min(1, "Select a category"),
  subCategory: z.string().optional(),
  brand: z.string().optional(),
  modelNumber: z.string().optional(),
  sku: z.string().optional(),
  status: z.enum(PRODUCT_STATUS, { required_error: "Select a status" }),
});

/* ------------------------------------------------------------------ */
/*  Step 3 — Description                                               */
/* ------------------------------------------------------------------ */

export const step3Schema = z.object({
  shortDescription: z
    .string()
    .min(20, "Short description must be at least 20 characters")
    .max(220, "Keep the short description under 220 characters"),
  detailedDescription: z
    .string()
    .min(50, "Detailed description must be at least 50 characters"),
  keyFeatures: z
    .array(z.string().min(1))
    .min(1, "Add at least one key feature"),
  applications: z.array(z.string().min(1)).default([]),
  benefits: z.array(z.string().min(1)).default([]),
});

/* ------------------------------------------------------------------ */
/*  Step 4 — Pricing & Inventory                                       */
/* ------------------------------------------------------------------ */

export const step4BaseSchema = z.object({
  currency: z.enum(CURRENCIES),
  priceType: z.enum(PRICE_TYPE),
  price: z.coerce.number().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  unit: z.string().min(1, "Specify a unit (e.g. piece, ton, meter)"),
  moq: z.coerce.number().min(1, "MOQ must be at least 1"),
  moqUnit: z.string().min(1, "Specify a MOQ unit"),
  stock: z.coerce.number().min(0, "Stock can't be negative"),
  stockUnit: z.string().min(1, "Specify a stock unit"),
});

function refinePricing(data: z.infer<typeof step4BaseSchema>, ctx: z.RefinementCtx) {
    if (data.priceType === "fixed" && (data.price === undefined || data.price <= 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["price"],
        message: "Enter a fixed price",
      });
    }
    if (data.priceType === "range") {
      if (!data.minPrice || data.minPrice <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["minPrice"],
          message: "Enter a minimum price",
        });
      }
      if (!data.maxPrice || data.maxPrice <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["maxPrice"],
          message: "Enter a maximum price",
        });
      }
      if (data.minPrice && data.maxPrice && data.minPrice > data.maxPrice) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["maxPrice"],
          message: "Maximum price must be greater than minimum price",
        });
      }
    }
}

export const step4Schema = step4BaseSchema.superRefine(refinePricing);

/* ------------------------------------------------------------------ */
/*  Step 5 — Specifications                                            */
/* ------------------------------------------------------------------ */

export const specificationSchema = z.object({
  id: z.string(),
  key: z.string().min(1, "Required"),
  value: z.string().min(1, "Required"),
});

export type Specification = z.infer<typeof specificationSchema>;

export const step5Schema = z.object({
  specifications: z
    .array(specificationSchema)
    .min(1, "Add at least one specification"),
});

/* ------------------------------------------------------------------ */
/*  Step 6 — Shipping & Manufacturing                                  */
/* ------------------------------------------------------------------ */

export const step6Schema = z.object({
  countryOfOrigin: z.string().min(1, "Select a country of origin"),
  productionCapacity: z.string().min(1, "Enter production capacity"),
  productionUnit: z.string().min(1, "Specify a unit (e.g. units/month)"),
  dispatchTime: z.string().min(1, "Enter dispatch time (e.g. 7-10 days)"),
  shippingAvailable: z.boolean().default(true),
  exportAvailable: z.boolean().default(true),
  deliveryTerms: z.array(z.enum(DELIVERY_TERMS)).min(1, "Select at least one delivery term"),
  packagingType: z.string().min(1, "Describe the packaging type"),
  packageWeight: z.string().min(1, "Enter package weight"),
  packageLength: z.string().optional(),
  packageWidth: z.string().optional(),
  packageHeight: z.string().optional(),
});

/* ------------------------------------------------------------------ */
/*  Step 7 — Certifications                                            */
/* ------------------------------------------------------------------ */

export const step7Schema = z.object({
  certifications: z.array(z.string()).default([]),
});

/* ------------------------------------------------------------------ */
/*  Step 9 — SEO & Tags                                                */
/* ------------------------------------------------------------------ */

export const step9Schema = z.object({
  tags: z.array(z.string().min(1)).min(1, "Add at least one tag"),
  metaTitle: z
    .string()
    .max(60, "Meta title should stay under 60 characters")
    .optional()
    .or(z.literal("")),
  metaDescription: z
    .string()
    .max(160, "Meta description should stay under 160 characters")
    .optional()
    .or(z.literal("")),
  keywords: z.array(z.string().min(1)).default([]),
});

/* ------------------------------------------------------------------ */
/*  Combined schema (steps 2 & 8 are validated separately since they   */
/*  hold File objects, not primitives)                                 */
/* ------------------------------------------------------------------ */

export const productFormSchema = step1Schema
  .merge(step3Schema)
  .merge(step4BaseSchema)
  .merge(step5Schema)
  .merge(step6Schema)
  .merge(step7Schema)
  .merge(step9Schema)
  .superRefine(refinePricing);

export type ProductFormValues = z.infer<typeof step1Schema> &
  z.infer<typeof step3Schema> &
  z.infer<typeof step4Schema> &
  z.infer<typeof step5Schema> &
  z.infer<typeof step6Schema> &
  z.infer<typeof step7Schema> &
  z.infer<typeof step9Schema>;

export const stepSchemas = [
  step1Schema,
  null, // step 2 — media, validated manually (mainImage required)
  step3Schema,
  step4Schema,
  step5Schema,
  step6Schema,
  step7Schema,
  null, // step 8 — documents, all optional
  step9Schema,
  null, // step 10 — review, no fields
];

export const STEP_META = [
  { id: 1, title: "Basic Information", description: "Name, category & identifiers" },
  { id: 2, title: "Images & Media", description: "Photos and product video" },
  { id: 3, title: "Description", description: "Tell buyers what it is" },
  { id: 4, title: "Pricing & Inventory", description: "Price, MOQ & stock" },
  { id: 5, title: "Specifications", description: "Technical attributes" },
  { id: 6, title: "Shipping & Manufacturing", description: "Origin & logistics" },
  { id: 7, title: "Certifications", description: "Compliance & quality marks" },
  { id: 8, title: "Documents", description: "Brochures & datasheets" },
  { id: 9, title: "SEO & Tags", description: "Search visibility" },
  { id: 10, title: "Review & Publish", description: "Confirm and go live" },
] as const;

/** Full wizard form shape: zod-validated fields plus file/media fields that
 *  live outside the schema (File objects aren't JSON-serializable, so they
 *  aren't part of productFormSchema, but they share the same RHF instance). */
export interface FullFormValues extends ProductFormValues {
  mainImage: UploadedImage[];
  additionalImages: UploadedImage[];
  videoUrl?: string;
  certificationFiles?: Record<string, UploadedDocument | undefined>;
  documents?: Record<string, UploadedDocument | undefined>;
}

export function defaultProductFormValues(): Partial<ProductFormValues> {
  return {
    status: "draft",
    currency: "USD",
    priceType: "fixed",
    keyFeatures: [],
    applications: [],
    benefits: [],
    specifications: [],
    deliveryTerms: [],
    shippingAvailable: true,
    exportAvailable: true,
    certifications: [],
    tags: [],
    keywords: [],
  };
}
