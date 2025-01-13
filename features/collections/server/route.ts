import prisma from "@/lib/prisma";
import { SessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { CreateCollectionSchema } from "../schemas";
import { UploadApiResponse } from "cloudinary";
import cloudinary from "@/lib/cloudinary";

const app = new Hono()
  .get("/", SessionMiddleware, async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const collections = await prisma.collection.findMany();

    if (!collections) {
      return c.json({ error: "No collections found" }, 404);
    }

    return c.json({ data: collections });
  })
  .get("/:collectionId", SessionMiddleware, async (c) => {
    const user = c.get("user");
    const { collectionId } = c.req.param();

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const collection = await prisma.collection.findUnique({
      where: {
        id: collectionId,
      },
    });

    if (!collection) {
      return c.json({ error: "Collection not found" }, 404);
    }

    return c.json({ data: collection });
  })
  .post(
    "/",
    SessionMiddleware,
    zValidator("json", CreateCollectionSchema),
    async (c) => {
      const user = c.get("user");
      const { name, description, image, books } = c.req.valid("json");
      console.log({ image });

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      let uploadResult;
      if (image) {
        try {
          let imageBuffer;

          if (typeof image === "string") {
            imageBuffer = Buffer.from(image, "base64"); // This is for base64 strings
          } else {
            throw new Error("Invalid image format");
          }

          uploadResult = await new Promise<UploadApiResponse | undefined>(
            (resolve, reject) => {
              cloudinary.uploader
                .upload_stream(
                  {
                    resource_type: "raw",
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
                .end(imageBuffer);
            },
          );
        } catch (err) {
          console.error("Cloudinary Upload Error: ", err);
          return c.json({ error: "Failed to upload book cover image." }, 500);
        }
      }

      const collection = await prisma.collection.create({
        data: {
          userId: user.id,
          name,
          description,
          image: uploadResult?.secure_url,
          books: {
            connect: books?.map((bookId: string) => ({ id: bookId })),
          },
        },
      });

      return c.json({ data: collection });
    },
  )
  .delete("/:collectionId", SessionMiddleware, async (c) => {
    const user = c.get("user");
    const { collectionId } = c.req.param();

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const existingCollection = await prisma.collection.findUnique({
      where: {
        id: collectionId,
      },
    });

    if (!existingCollection) {
      return c.json({ error: "Collection not found" }, 404);
    }

    await prisma.collection.delete({ where: { id: collectionId } });

    return c.json({ message: "Collection deleted successfully" });
  });

export default app;
