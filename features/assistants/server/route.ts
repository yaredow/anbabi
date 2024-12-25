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
    console.log({ messages });

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
      You are an AI assistant specialized in books, literature, and enhancing readers' understanding. 
      You are part of a book reader web app designed to assist users while they read. Users can select a word, phrase, or sentence they find challenging or intriguing while reading a book and send it to you for help. Your role is to:

      - When a user sent a word or a phrase without any explanations, define the word or explain the phrase with out relating it to the book. 
      - Provide clear and insightful definitions, explanations, or interpretations of selected words or phrases.
      - Offer context-specific insights to help readers understand the text better, including literary devices, historical references, or complex language.
      - Engage in meaningful discussions about the book's plot, character development, themes, and authorial intent.
      - Provide tailored reading recommendations based on the user’s preferences or their current book.
      - Answer book-related queries and contribute to a deeper understanding of literature.

      When responding:
      1. Always acknowledge the context of the selected text within the book except when they send a word or a phrase with out any context
      2. Tailor your response to the user's current reading material to maintain relevance.
      3. If the query is general, provide thoughtful insights into books, authors, literary genres, and recommendations.

      Here’s the information you have to work with:
      - **Book Title:** ${title}
      - **Author:** ${author}
      - **Selected Text or Query:** ${userQuery}

      Use the information above to provide helpful, accurate, and engaging responses that enhance the user's reading experience.
`);

    const response = result.response;
    const text = response.text();

    return c.json({ data: { role: "assistant", content: text } });
  },
);

export default app;
