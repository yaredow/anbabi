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

    await prisma.account.delete({
      where: {
        userId: user.id,
      },
    });

    return c.json({ message: "Account deleted successfully" });
  })
  .post(
    "/update-password",
    SessionMiddleware,
    zValidator("json", PasswordUpdateSchema),
    async (c) => {
      try {
        const user = c.get("user");
        const { currentPassword, newPassword } = c.req.valid("json");

        if (!user) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        // Prevent setting the same password
        if (currentPassword === newPassword) {
          return c.json(
            { error: "New password must be different from current password" },
            400,
          );
        }

        // Secure account lookup and password comparison
        const accountRecord = await prisma.account.findFirst({
          where: { userId: user.id },
        });

        // Prevent timing attacks by always running comparison
        const isPasswordValid = accountRecord
          ? await bcrypt.compare(currentPassword, accountRecord.password!)
          : false;

        if (!isPasswordValid) {
          return c.json({ error: "Current password is incorrect" }, 400);
        }

        // Update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.account.update({
          where: { userId: user.id },
          data: { password: hashedPassword },
        });

        await prisma.session.deleteMany({
          where: { userId: user.id },
        });

        return c.json({ message: "Password updated successfully" });
      } catch (error) {
        console.error("Password update error:", error);
        return c.json({ error: "Internal server error" }, 500);
      }
    },
  );

export default app;
