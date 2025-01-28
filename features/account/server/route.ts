import prisma from "@/lib/prisma";
import { SessionMiddleware } from "@/lib/session-middleware";
import { Hono } from "hono";
import {
  PasswordUpdateSchema,
  PasswordUpdateData,
} from "@/features/auth/schemas";
import bcrypt from "bcrypt";
import { zValidator } from "@hono/zod-validator";

const app = new Hono()
  .delete("/delete", SessionMiddleware, async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });

    return c.json({ message: "Account deleted successfully" });
  })
  .post(
    "/update-password",
    SessionMiddleware,
    zValidator("json", PasswordUpdateSchema),
    async (c) => {
      const user = c.get("user");
      const { currentPassword, newPassword } = c.req.valid("json");

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      await prisma.account.update({
        where: {
          user: { id: user.id },
        },
        data: {
          password: hashedPassword,
        },
      });

      return c.json({ message: "Password updated successfully" });
    },
  );

export default app;
