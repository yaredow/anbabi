import prisma from "@/lib/prisma";
import { Book } from "@prisma/client";

export const getAllBooks = async (userId: string): Promise<Book[] | null> => {
  if (!userId) {
    return null;
  }

  const books = await prisma.book.findMany({
    where: {
      uploader: {
        id: userId,
      },
    },
  });

  if (!books) {
    return null;
  }

  return books;
};
