import prisma from "@/lib/prisma";

export const getAllBooks = async (userId: string) => {
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
