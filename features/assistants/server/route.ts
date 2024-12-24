import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AiChatSchema } from "../schemas";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

const app = new Hono().post(
  "/ask-ai",
  zValidator("json", AiChatSchema),
  async (c) => {
    const { messages, author, title } = c.req.valid("json");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: messages.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      })),
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const userQuery = messages[messages.length - 1]?.content;

    if (!userQuery) {
      return c.json({ error: "User query is missing." }, 400);
    }

    const result = await chat.sendMessage(`
      You are an AI assistant specialized in books and literature. 
      Provide insightful answers about books, authors, literary genres, and reading recommendations. 
      Engage in discussions about plot analysis, character development, and themes in literature. 
      Offer reading suggestions based on user preferences and help with book-related queries.
      
      Book title: ${title}
      Author: ${author}
      User query: ${userQuery}
    `);

    const response = result.response;
    const text = response.text();

    return c.json({ data: { role: "assistant", content: text } });
  },
);

export default app;
