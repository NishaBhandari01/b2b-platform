import { z } from "zod";

export const createRFQSchema = z.object({
  title: z.string().trim().min(3),
  category: z.string().trim().min(2),
  quantity: z.coerce.number().int().positive(),
  budget: z.coerce.number().positive(),
  deadline: z.coerce.date(),
  description: z.string().trim().min(10),
});

export const updateRFQSchema = z.object({
  title: z.string().trim().min(3).optional(),
  category: z.string().trim().min(2).optional(),
  quantity: z.coerce.number().int().positive().optional(),
  budget: z.coerce.number().positive().optional(),
  deadline: z.coerce.date().optional(),
  description: z.string().trim().min(10).optional(),
});

export const createQuotationSchema = z.object({
  price: z.coerce.number().positive(),
  leadTime: z.string().trim().min(2),
  message: z.string().trim().min(10),
});

export const sendMessageSchema = z.object({
  receiverId: z.string().cuid(),
  text: z.string().trim().min(1),
});

export const updateQuotationStatusSchema = z.object({
  status: z.enum(["accepted", "rejected"]),
});

export type CreateRFQDto = z.infer<typeof createRFQSchema>;
export type UpdateRFQDto = z.infer<typeof updateRFQSchema>;
export type CreateQuotationDto = z.infer<typeof createQuotationSchema>;
export type SendMessageDto = z.infer<typeof sendMessageSchema>;
export type UpdateQuotationStatusDto = z.infer<
  typeof updateQuotationStatusSchema
>;
