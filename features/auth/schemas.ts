import { z } from "zod";

export const SignInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export type SignInData = z.infer<typeof SignInSchema>;

export const SignUpSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must not exceed 50 characters" }),
});

export type SignUpData = z.infer<typeof SignUpSchema>;

export const PasswordForgetSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export type PasswordForgetData = z.infer<typeof PasswordForgetSchema>;
