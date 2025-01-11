import { z } from "zod";

export const CreateCollectionSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Collection name is required" })
    .max(100, { message: "Collection name cannot exceed 100 characters" }),
  description: z
    .string()
    .max(255, { message: "Description cannot exceed 255 characters" })
    .optional(),
  userId: z.string().uuid({ message: "Invalid user ID" }),
  image: z.string().url({ message: "Invalid image URL" }).optional(),
  bookIds: z.array(z.string().uuid({ message: "Invalid book ID" })).optional(), // Optional since users may create a collection without books
});

export type CreateCollectionData = z.infer<typeof CreateCollectionSchema>;
