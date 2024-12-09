import prisma from "@/lib/prisma";
import { Hono } from "hono";

const app = new Hono().get("/", async (c) => {
  const books = await prisma.book.findMany();

  if (!books) {
    return c.json({ error: "There are no books" });
  }

  return c.json({ data: books });
});

export default app;
