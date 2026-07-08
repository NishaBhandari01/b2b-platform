import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3),

  email: z.string().email(),

  password: z.string().min(8),

  role: z.enum(["buyer", "supplier", "admin"]),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginSchema = z.infer<typeof loginSchema>;
