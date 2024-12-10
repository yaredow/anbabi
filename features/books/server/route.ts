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

    return c.json({ data: books });
  })
  .post("/upload", zValidator("json", BookSchema), async (c) => {
    const {
      title,
      isbn,
      author,
      language,
      arrayBuffer,
      publisher,
      description,
      publicationYear,
    } = c.req.valid("json");

    const uploadResult = await new Promise<UploadApiResponse | undefined>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              tags: ["ai-book"],
              upload_preset: "ai-books",
            },
            function (err, result) {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            },
          )
          .end(arrayBuffer);
      },
    );

    const book = await prisma.book.create({
      data: {
        title,
        author,
        language,
        description,
        coverUrl: uploadResult?.secure_url as string,
        coverPublicId: uploadResult?.public_id as string,
        publicationYear,
        isbn,
        publisher,
      },
    });

    if (!book) {
      return c.json({ error: "Uploading book failed" }, 400);
    }

    return c.json({ data: book });
  });

export default app;
