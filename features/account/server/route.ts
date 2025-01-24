import prisma from "@/lib/prisma";
import { SessionMiddleware } from "@/lib/session-middleware";
import { Hono } from "hono";

const app = new Hono().delete("/delete", SessionMiddleware, async (c) => {
  const user = c.get("user");

  if (!user) {
    return c.json({ error: "Unautherized" }, 401);
  }

  await prisma.user.delete({
    where: {
      id: user.id,
    },
  });

  return c.json({ message: "Account deleted successfully" });
});

export default app;
