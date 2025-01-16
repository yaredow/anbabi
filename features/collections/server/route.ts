import prisma from "@/lib/prisma";
import { SessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  AddBooksToCollectionSchema,
  CreateCollectionSchema,
  UpdateCollectionSchema,
} from "../schemas";
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
      include: {
        books: true,
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

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      let uploadResult;

      if (image) {
        try {
          let imageBuffer;

          if (typeof image === "string") {
            const base64Data = image.split(",")[1];
            imageBuffer = Buffer.from(base64Data, "base64"); // This is for base64 strings
          } else {
            throw new Error("Invalid image format");
          }

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
  .post(
    "/:collectionId/books",
    zValidator("json", AddBooksToCollectionSchema),
    SessionMiddleware,
    async (c) => {
      const user = c.get("user");
      const { collectionId } = c.req.param();
      const { bookIds } = c.req.valid("json");

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const existingCollection = await prisma.collection.findUnique({
        where: {
          id: collectionId,
        },
        include: {
          books: true,
        },
      });

      if (!existingCollection) {
        return c.json({ error: "Collection not found" }, 404);
      }

      await prisma.collection.update({
        where: {
          id: collectionId,
        },
        data: {
          books: {
            connect: bookIds.map((bookId: string) => ({ id: bookId })),
          },
        },
      });

      return c.json({ message: "Books are added to collection" });
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
  })
  .delete("/:collectionId/books/:bookId", SessionMiddleware, async (c) => {
    const user = c.get("user");
    const { collectionId, bookId } = c.req.param();

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const existingCollection = await prisma.collection.findUnique({
      where: {
        id: collectionId,
      },
      include: {
        books: true,
      },
    });

    if (!existingCollection) {
      return c.json({ error: "Collection not found" }, 404);
    }

    const bookExistsInCollection = existingCollection.books.some(
      (book) => book.id === bookId,
    );

    if (!bookExistsInCollection) {
      return c.json({ error: "Book not found in the collection" }, 404);
    }

    await prisma.collection.update({
      where: {
        id: collectionId,
      },
      data: {
        books: {
          disconnect: { id: bookId },
        },
      },
    });

    const bookCount = await prisma.collection.count({
      where: {
        id: collectionId,
        books: {
          some: {},
        },
      },
    });

    if (bookCount === 0) {
      await prisma.collection.delete({
        where: {
          id: collectionId,
        },
      });
    }

    return c.json({ message: "Book removed from collection successfully" });
  })
  .patch(
    "/:collectionId",
    SessionMiddleware,
    zValidator("json", UpdateCollectionSchema),
    async (c) => {
      const user = c.get("user");
      const { collectionId } = c.req.param();
      const { name, description, image, books } = c.req.valid("json");

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

      await prisma.collection.update({
        where: {
          id: collectionId,
        },
        data: {
          name,
          description,
          image,
          books: {
            set: books?.map((bookId: string) => ({ id: bookId })),
          },
        },
      });

      return c.json({ message: "Collection updated successfully" });
    },
  );

export default app;
