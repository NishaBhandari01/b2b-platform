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

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100)
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});
