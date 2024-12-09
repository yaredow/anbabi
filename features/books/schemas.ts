import { z } from "zod";

export const BookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string().optional(),
  coverImageUrl: z.string().url("Invalid URL for cover image"),
  fileUrl: z.string().url("Invalid URL for book file"),
  genres: z.array(z.string().min(1)).nonempty("At least one genre is required"),
  language: z.string().min(1, "Language is required"),
  publicationYear: z
    .number()
    .int("Publication year must be an integer")
    .positive("Publication year must be positive")
    .optional(),
  isbn: z.string().optional(),
  pageCount: z
    .number()
    .int("Page count must be an integer")
    .positive("Page count must be positive")
    .optional(),
  publisher: z.string().optional(),
  uploadedAt: z.date().optional().default(new Date()),
  uploaderId: z.string().min(1, "Uploader ID is required"),
});

export type Book = z.infer<typeof BookSchema>;
