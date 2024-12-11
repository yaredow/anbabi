import { z } from "zod";

export const BookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string().optional(),
  language: z.string().min(1, "Language is required"),
  publicationYear: z
    .number()
    .int("Publication year must be an integer")
    .positive("Publication year must be positive")
    .optional(),
  isbn: z.string().optional(),
  publisher: z.string().optional(),
  uploadedAt: z.date().optional().default(new Date()),
  base64Data: z
    .string()
    .regex(
      /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
      "Invalid base64 data",
    ),
});
export type Book = z.infer<typeof BookSchema>;
