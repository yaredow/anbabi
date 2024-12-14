import prisma from "@/lib/prisma";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { BookSchema } from "../schemas";
import { UploadApiResponse } from "cloudinary";
import cloudinary from "@/lib/cloudinary";

const app = new Hono()
  .get("/", async (c) => {
    const books = await prisma.book.findMany();

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
  .get("/:bookId", async (c) => {
    const { bookId } = c.req.param();

    const book = await prisma.book.findUnique({
      where: { id: bookId },
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
  .post("/upload", zValidator("json", BookSchema), async (c) => {
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
                  reject(new Error("Cloudinary upload failed: " + err.message));
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

    if (!uploadResult || !uploadResult.secure_url || !uploadResult.public_id) {
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

    if (!book) {
      return c.json({ error: "Uploading book failed." }, 400);
    }

    return c.json({ data: book });
  });
export default app;
