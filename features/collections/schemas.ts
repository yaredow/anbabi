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

export const UpdateCollectionSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Collection name is required" })
    .max(100, { message: "Collection name cannot exceed 100 characters" })
    .optional(),
  description: z
    .string()
    .max(255, { message: "Description cannot exceed 255 characters" })
    .optional(),
  image: z
    .string()
    .optional()
    .refine(
      (value) => {
        // Allow both a Cloudinary URL and a base64-encoded string
        if (!value) return true; // Allow undefined/optional
        const isBase64 = value.startsWith("data:image/");
        const isCloudinaryURL = value.startsWith("http");
        return isBase64 || isCloudinaryURL;
      },
      {
        message: "Image must be a valid URL or a base64-encoded string",
      },
    ),
  books: z.array(z.string().cuid()).optional(),
});

export type UpdateCollectionData = z.infer<typeof UpdateCollectionSchema>;

export const AddBooksToCollectionSchema = z.object({
  bookIds: z.array(z.string().cuid()),
});
