import { z } from "zod";

export const ProductStatusEnum = z.enum([
  "draft",
  "active",
  "out_of_stock",
  "archived",
]);

export const PriceTypeEnum = z.enum(["fixed", "range", "rfq"]);

/**
 * Dynamic Specification
 *
 * Example:
 * {
 *   key: "Material",
 *   value: "Stainless Steel"
 * }
 */
const specificationSchema = z.object({
  key: z.string().trim().min(1),
  value: z.string().trim().min(1),
});

/**
 * Shipping Information
 */
const shippingInfoSchema = z.object({
  countryOfOrigin: z.string().optional(),
  // productionCapacity: z.number().optional(),
  productionCapacity: z.number().nullable().optional(),
  productionUnit: z.string().optional(),
  dispatchTime: z.string().optional(),
  shippingAvailable: z.boolean().optional(),
  exportAvailable: z.boolean().optional(),
  deliveryTerms: z.string().optional(),
  packagingType: z.string().optional(),
  packageWeight: z.string().optional(),
  packageDimensions: z.string().optional(),
});

const productImageSchema = z.object({
  url: z.string().url(),
  publicId: z.string(),
  isPrimary: z.boolean().optional(),
  displayOrder: z.number().optional(),
});

const productDocumentSchema = z.object({
  type: z.enum([
    "brochure",
    "datasheet",
    "catalog",
    "manual",
    "safety_sheet",
    "certification",
  ]),
  fileName: z.string(),
  fileUrl: z.string().url(),
  publicId: z.string().optional(),
});

/**
 * Create Product Validation
 *
 * Validates req.body directly
 */
export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Product name must be at least 3 characters")
    .max(200),

  category: z.string().trim().min(2, "Category is required"),

  subCategory: z.string().trim().optional(),

  brand: z.string().trim().optional(),

  modelNumber: z.string().trim().optional(),

  sku: z.string().trim().optional(),

  status: ProductStatusEnum.optional(),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),

  shortDescription: z.string().trim().optional(),

  videoUrl: z.string().url("Invalid video URL").optional(),

  keyFeatures: z.array(z.string()).optional(),

  applications: z.array(z.string()).optional(),

  benefits: z.array(z.string()).optional(),

  priceType: PriceTypeEnum.optional(),

  currency: z.string().optional(),

  price: z.number().nonnegative().optional(),

  minPrice: z.number().nonnegative().optional(),

  maxPrice: z.number().nonnegative().optional(),

  unit: z.string().optional(),

  minOrderQty: z.number().int().positive().optional(),

  moqUnit: z.string().optional(),

  availableQuantity: z.number().int().nonnegative().optional(),

  stockUnit: z.string().optional(),

  specifications: z.array(specificationSchema).optional(),

  shippingInfo: shippingInfoSchema.optional(),

  certifications: z.array(z.string()).optional(),

  tags: z.array(z.string()).optional(),

  keywords: z.array(z.string()).optional(),

  seoTitle: z.string().max(70).optional(),

  seoDescription: z.string().max(160).optional(),
  images: z.array(productImageSchema).optional(),
  documents: z.array(productDocumentSchema).optional(),
});

/**
 * Product Update Validation
 *
 * Everything optional
 */
export const updateProductSchema = createProductSchema.partial();

/**
 * Publish Product Validation
 */
export const publishProductSchema = z.object({
  status: ProductStatusEnum.refine(
    (value) => value === "active",
    "Status must be active",
  ),
});
