import { zValidator } from "@hono/zod-validator";
import { UploadApiResponse } from "cloudinary";
import { Hono } from "hono";

import { SessionMiddleware } from "@/lib/session-middleware";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";

import { BookSchema, StatusType } from "../schemas";
import { z } from "zod";
import { Book } from "@prisma/client";

const app = new Hono()
  .get(
    "/",
    SessionMiddleware,
    zValidator("query", z.object({ category: z.string() })),
    async (c) => {
      const user = c.get("user");
      const { category } = c.req.valid("query");

      if (!user) {
        return c.json({ error: "Unautherized" }, 401);
      }

      let books: Book[] = [];

      if (category !== "all") {
        books = await prisma.book.findMany({
          where: {
            uploader: {
              id: user.id,
            },
            categories: {
              has: category,
            },
          },
        });
      } else {
        books = await prisma.book.findMany();
      }

      if (!books) {
        return c.json({ error: "There are no books" }, 400);
      }

      return c.json({ data: books });
    },
  )
  .get("/:bookId", SessionMiddleware, async (c) => {
    const user = c.get("user");
    const { bookId } = c.req.param();

    if (!user) {
      return c.json({ error: "Unautherized" }, 401);
    }

    const book = await prisma.book.findUnique({
      where: { id: bookId, uploader: { id: user.id } },
    });

    if (!book) {
      return c.json({ error: "No book available with that id" }, 400);
    }

    return c.json({
      data: book,
    });
  })
  .get("/categories/count", SessionMiddleware, async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unautherized" }, 401);
    }

    const categoryCount = await prisma.book.groupBy({
      by: ["categories"],
      _count: {
        categories: true,
      },
    });

    return c.json({ data: categoryCount });
  })
  .post(
    "/upload",
    SessionMiddleware,
    zValidator("json", BookSchema),
    async (c) => {
      const user = c.get("user");

      const {
        title,
        isbn,
        author,
        language,
        base64Data,
        publisher,
        publicationYear,
      } = c.req.valid("json");

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Fetch Google Books data
      let googleBookDetails: {
        coverImage: string | null;
        categories: string[];
        pageCount: number | null;
        description: string | null;
      } = {
        coverImage: null,
        categories: [],
        pageCount: null,
        description: null,
      };

      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
            title,
          )}+inauthor:${encodeURIComponent(
            author,
          )}&key=${process.env.GOOGLE_BOOK_API_KEY}`,
        );
        const googleData = await response.json();
        const googleBook = googleData.items?.[0]?.volumeInfo;

        googleBookDetails = {
          coverImage: googleBook?.imageLinks?.thumbnail || null,
          categories:
            googleBook?.categories.map((category: string) =>
              category.toLowerCase(),
            ) || [],
          pageCount: googleBook?.pageCount || null,
          description: googleBook?.description || null,
        };
      } catch (error) {
        console.error("Google Books API Error:", error);
      }

      // Upload cover image
      let uploadResult;
      try {
        const fileBuffer = Buffer.from(base64Data, "base64");
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
              .end(fileBuffer);
          },
        );
      } catch (err) {
        console.error("Cloudinary Upload Error: ", err);
        return c.json({ error: "Failed to upload book cover image." }, 500);
      }

      if (
        !uploadResult ||
        !uploadResult.secure_url ||
        !uploadResult.public_id
      ) {
        console.error("Cloudinary upload result is incomplete", uploadResult);
        return c.json(
          { error: "Cloudinary upload failed to return valid result." },
          500,
        );
      }

      const existingBook = await prisma.book.findFirst({
        where: {
          title,
        },
      });

      if (existingBook) {
        return c.json(
          {
            error: `Book with title ${existingBook.title} already exists`,
          },
          400,
        );
      }

      // Save book in the database
      const book = await prisma.book.create({
        data: {
          uploader: {
            connect: { id: user.id },
          },
          title,
          author,
          language,
          bookUrl: uploadResult.url as string,
          coverPublicId: uploadResult.public_id as string,
          publicationYear,
          isbn,
          publisher,
          description: googleBookDetails.description,
          categories: googleBookDetails.categories,
          coverImage: googleBookDetails.coverImage,
          pageCount: googleBookDetails.pageCount,
        },
      });

      return c.json({ data: book }, 201);
    },
  )
  .delete("/:bookId", SessionMiddleware, async (c) => {
    const user = c.get("user");
    const { bookId } = c.req.param();

    if (!user) {
      return c.json({ error: "Unautherized" }, 401);
    }

    const existingBook = await prisma.book.findUnique({
      where: {
        id: bookId,
      },
    });

    if (!existingBook) {
      return c.json({ error: "No book exists with that id" }, 400);
    }

    await cloudinary.api.delete_resources([`${existingBook.coverPublicId}`], {
      type: "upload",
      resource_type: "raw",
    });

    await prisma.book.delete({
      where: {
        id: bookId,
      },
    });

    return c.json({ message: "book deleted successfully" });
  })
  .patch(
    "/status/:bookId",
    SessionMiddleware,
    zValidator("query", z.object({ status: StatusType })),
    async (c) => {
      const user = c.get("user");
      const { bookId } = c.req.param();
      const { status } = c.req.valid("query");

      if (!user) {
        return c.json({ error: "Unautherized" }, 401);
      }

      const book = await prisma.book.findUnique({
        where: {
          id: bookId,
        },
      });

      if (!book) {
        return c.json({ error: "No book exists with that id" }, 400);
      }

      await prisma.book.update({
        where: {
          id: bookId,
        },
        data: {
          status,
        },
      });

      return c.json({ message: "book status updated successfully" });
    },
  );
export default app;
