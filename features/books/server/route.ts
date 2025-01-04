import { zValidator } from "@hono/zod-validator";
import { UploadApiResponse } from "cloudinary";
import { Hono } from "hono";

import { SessionMiddleware } from "@/lib/session-middleware";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";

import { BookSchema, StatusType } from "../schemas";
import { z } from "zod";

const app = new Hono()
  .get("/", SessionMiddleware, async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unautherized" }, 401);
    }

    const books = await prisma.book.findMany({
      where: {
        uploader: {
          id: user.id,
        },
      },
    });

    if (!books) {
      return c.json({ error: "There are no books" }, 400);
    }

    const booksWithDetail = await Promise.all(
      books.map(async (book) => {
        try {
          const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
              book.title,
            )}+inauthor:${encodeURIComponent(book.author)}&key=${process.env.GOOGLE_BOOK_API_KEY}`,
          );

          const googleData = await response.json();
          const googleBook = googleData.items?.[0].volumeInfo;

          return {
            ...book,
            coverImage: googleBook?.imageLinks?.thumbnail || null,
            description: googleBook?.description || null,
            pageCount: googleBook?.pageCount || null,
            genre: googleBook?.categories?.[0] || null,
          };
        } catch (error) {
          console.error(error);
        }
      }),
    );

    return c.json({ data: booksWithDetail });
  })
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

    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
        book.title,
      )}+inauthor:${encodeURIComponent(book.author)}&key=${process.env.GOOGLE_BOOK_API_KEY}`,
    );

    const googleData = await response.json();
    const googleBook = googleData.items?.[0].volumeInfo;

    return c.json({
      data: {
        ...book,
        coverImage: googleBook?.imageLinks?.thumbnail || null,
        description: googleBook?.description || null,
        pageCount: googleBook?.pageCount || null,
        genre: googleBook?.categories?.[0] || null,
      },
    });
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
        description,
        publicationYear,
      } = c.req.valid("json");

      if (!user) {
        return c.json({ error: "Unautherized" }, 401);
      }

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
            error: `book with title ${existingBook.title} already exists`,
          },
          400,
        );
      }

      const book = await prisma.book.create({
        data: {
          uploader: {
            connect: { id: user.id },
          },
          title,
          author,
          language,
          description,
          bookUrl: uploadResult.url as string,
          coverPublicId: uploadResult.public_id as string,
          publicationYear,
          isbn,
          publisher,
        },
      });

      return c.json({ data: book }, 201);
    },
  )
  .delete("/:bookId", SessionMiddleware, async (c) => {
    const user = c.get("user");
    const { bookId } = c.req.param();
    console.log({ bookId });

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

    await prisma.book.delete({
      where: {
        id: bookId,
      },
    });

    await cloudinary.api.delete_resources([existingBook.coverPublicId]);

    return c.json({ message: "book deleted successfully" });
  })
  .put(
    "/status/:bookId",
    SessionMiddleware,
    zValidator("query", StatusType),
    async (c) => {
      const user = c.get("user");
      const { bookId } = c.req.param();
      const status = c.req.valid("query");

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
          status: status,
        },
      });
    },
  );
export default app;
