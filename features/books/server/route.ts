import { UploadApiResponse } from "cloudinary";
import { Hono } from "hono";
import { z } from "zod";

import { zValidator } from "@hono/zod-validator";
import { SessionMiddleware } from "@/lib/session-middleware";
import { normalizeCategory } from "@/lib/utils";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";

import { BookSchema, StatusType } from "../schemas";
import { Book } from "@prisma/client";

const querySchema = z.object({
  category: z.string().optional(),
  status: z.nativeEnum(StatusType).optional(),
});

const app = new Hono()
  .get("/", SessionMiddleware, async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const books = await prisma.book.findMany({
      where: {
        uploader: {
          id: user.id,
        },
      },
      orderBy: { uploadedAt: "desc" },
    });

    if (!books) {
      return c.json({ error: "No books found" }, 404);
    }

    return c.json({ data: books });
  })
  .get(
    "/filter",
    SessionMiddleware,
    zValidator("query", querySchema),
    async (c) => {
      const user = c.get("user");
      const { category, status } = c.req.valid("query");

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      let books: Book[] = [];

      if (category) {
        if (category === "all") {
          // Fetch all books if category is "all"
          books = await prisma.book.findMany({
            where: {
              uploader: {
                id: user.id,
              },
            },
            orderBy: { uploadedAt: "desc" },
          });
        } else {
          const normalizedCategory = normalizeCategory(category);

          // Fetch all books uploaded by the user
          const allBooks = await prisma.book.findMany({
            where: {
              uploader: {
                id: user.id,
              },
            },
            orderBy: { uploadedAt: "desc" },
          });

          // Filter books by normalized category
          books = allBooks.filter((book) =>
            book.categories.some(
              (cat) => normalizeCategory(cat) === normalizedCategory,
            ),
          );
        }
      } else if (status) {
        // Fetch books by status
        books = await prisma.book.findMany({
          where: {
            uploader: {
              id: user.id,
            },
            status,
          },
          orderBy: { uploadedAt: "desc" },
        });
      } else {
        // If neither category nor status is provided, return all books
        books = await prisma.book.findMany({
          where: {
            uploader: {
              id: user.id,
            },
          },
          orderBy: { uploadedAt: "desc" },
        });
      }

      if (!books.length) {
        return c.json({ error: "No books found", data: [] }, 404);
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

    const books = await prisma.book.findMany({
      where: {
        uploader: {
          id: user.id,
        },
      },
      select: {
        categories: true,
        status: true,
      },
    });

    // Flatten and count categories
    const categoryCount = books
      .flatMap((book) => book.categories || [])
      .map((category) => normalizeCategory(category))
      .reduce<Record<string, number>>((acc, normalizedCategory) => {
        acc[normalizedCategory] = (acc[normalizedCategory] || 0) + 1;
        return acc;
      }, {});

    const libraryCount = books.reduce<Record<string, number>>((acc, book) => {
      if (book) {
        acc[book.status] = (acc[book.status] || 0) + 1;
      }
      return acc;
    }, {});

    const totalBooks = books.length;

    return c.json({ data: { categoryCount, totalBooks, libraryCount } });
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
    zValidator("query", z.object({ status: z.nativeEnum(StatusType) })),
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
