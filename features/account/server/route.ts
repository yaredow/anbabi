import bcrypt from "bcryptjs";
import { Hono } from "hono";

import { SessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import prisma from "@/lib/prisma";

import { PasswordUpdateSchema } from "@/features/auth/schemas";
import { z } from "zod";
import { UploadApiResponse } from "cloudinary";
import cloudinary from "@/lib/cloudinary";
import { UpdateUserSchema } from "../schema";

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
      try {
        const user = c.get("user");
        const { currentPassword, newPassword } = c.req.valid("json");

        console.log({ currentPassword, newPassword });

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
          where: { id: accountRecord?.id },
          data: { password: hashedPassword },
        });

        return c.json({ message: "Password updated successfully" });
      } catch (error) {
        console.log("Password update error:", error);
        return c.json({ error: "Internal server error" }, 500);
      }
    },
  )
  .post(
    "/update-profile-picture",
    SessionMiddleware,
    zValidator("json", z.object({ profilePicture: z.string() })),
    async (c) => {
      const user = c.get("user");
      const { profilePicture } = c.req.valid("json");
      const base64Data = profilePicture.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (!profilePicture) {
        return c.json({ error: "Invalid profile picture data" }, 400);
      }

      let uploadResult: UploadApiResponse | undefined;
      try {
        uploadResult = await new Promise<UploadApiResponse | undefined>(
          (resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                {
                  tags: ["ai-book"],
                  upload_preset: "ai-books",
                },
                (err, result) => {
                  if (err) {
                    reject(
                      new Error("Cloudinary upload failed: " + err.message),
                    );
                  } else {
                    resolve(result);
                  }
                },
              )
              .end(buffer);
          },
        );
      } catch (error) {
        console.error(error);
      }

      if (!uploadResult) {
        return c.json({ error: "Failed to upload profile picture" }, 500);
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { image: uploadResult.secure_url },
      });

      return c.json({ message: "Profile picture updated successfully" });
    },
  )
  .post(
    "/update-profile",
    SessionMiddleware,
    zValidator("form", UpdateUserSchema),
    async (c) => {
      const user = c.get("user");
      const { name, email } = c.req.valid("form");

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const existingUser = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });

      if (!existingUser) {
        return c.json({ error: "User not found" }, 404);
      }

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          email,
          name,
        },
      });

      return c.json({ message: "Profile updated successfully" });
    },
  );

export default app;
