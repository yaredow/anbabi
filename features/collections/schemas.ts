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
  image: z.union([z.string(), z.undefined()]).optional(),
  books: z.array(z.string().cuid()).optional(),
});

export type CreateCollectionData = z.infer<typeof CreateCollectionSchema>;
