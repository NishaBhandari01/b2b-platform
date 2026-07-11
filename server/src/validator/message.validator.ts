import { z } from 'zod';

export const createMessageSchema = z.object({
  rfqId: z.string().min(1, 'rfqId is required'),
  supplierId: z.string().min(1, 'supplierId is required'),
  text: z.string().min(1, 'Message text cannot be empty'),
});
