import prisma from "@/lib/prisma";
import { Book, Collection } from "@prisma/client";

export const getCollection = async (
  collectionId: string,
): Promise<Collection | null> => {
  const collections = await prisma.collection.findUnique({
    where: {
      id: collectionId,
    },
  });

  if (!collections) return null;

  return collections;
};

export const getBooksWithCollectionId = async (
  collectionId: string,
): Promise<Book[] | null> => {
  const books = await prisma.book.findMany({
    where: {
      collections: {
        some: {
          id: collectionId,
        },
      },
    },
  });

  if (!books) return [];

  return books;
};
