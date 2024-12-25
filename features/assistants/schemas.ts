import { z } from "zod";

export const AiChatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "model"]),
      content: z.string().min(1),
    }),
  ),
  title: z.string(),
  author: z.string(),
});
