import { z } from "zod";

export const createRFQSchema = z.object({
  title: z.string().trim().min(3),
  category: z.string().trim().min(2),
  quantity: z.coerce.number().int().positive(),
  budget: z.coerce.number().positive(),
  deadline: z.coerce.date(),
  description: z.string().trim().min(10),
});

export const createQuotationSchema = z.object({
  price: z.coerce.number().positive(),
  leadTime: z.string().trim().min(2),
  message: z.string().trim().min(10),
});

export const updateQuotationStatusSchema = z.object({
  status: z.enum(["accepted", "rejected"]),
});

export type CreateRFQDto = z.infer<typeof createRFQSchema>;
export type CreateQuotationDto = z.infer<typeof createQuotationSchema>;
export type UpdateQuotationStatusDto = z.infer<
  typeof updateQuotationStatusSchema
>;
