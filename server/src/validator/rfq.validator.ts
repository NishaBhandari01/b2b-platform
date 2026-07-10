import { z } from "zod";

export const createRFQSchema = z.object({
  title: z.string().min(3),
  category: z.string().min(2),
  quantity: z.number().positive(),
  budget: z.number().positive(),
  deadline: z.coerce.date(),
  description: z.string().min(10),
});

export type CreateRFQDto = z.infer<typeof createRFQSchema>;
