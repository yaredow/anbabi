import { z } from "zod";

export const UpdateUserSchema = z.object({
  email: z.string().email().optional().describe("The user's email address"),
  name: z.string().min(1).optional().describe("The user's name"),
});

export type UpdateUserData = z.infer<typeof UpdateUserSchema>;
