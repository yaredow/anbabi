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
  arrayBuffer: z.custom<ArrayBuffer>((value) => value instanceof ArrayBuffer, {
    message: "Invalid ArrayBuffer",
  }),
});
export type Book = z.infer<typeof BookSchema>;
