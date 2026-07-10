import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3),

  email: z.string().email(),

  password: z.string().min(8),

  role: z.enum(["buyer", "supplier", "admin"]),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type LoginSchema = z.infer<typeof LoginSchema>;

export const GoogleAuthSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  role: z.enum(["buyer", "supplier", "admin"]).optional(),
});
export type GoogleAuthSchema = z.infer<typeof GoogleAuthSchema>;

const loginResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    role: z.enum(["buyer", "supplier", "admin"]),
  }),
});

export type LoginResponseSchema = z.infer<typeof loginResponseSchema>;
