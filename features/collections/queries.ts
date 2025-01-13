import prisma from "@/lib/prisma";
import { Collection } from "@prisma/client";

type GetCollectionsProps = {
  collectionId: string;
};

export const getCollection = async ({
  collectionId,
}: GetCollectionsProps): Promise<Collection | null> => {
  const collections = await prisma.collection.findUnique({
    where: {
      id: collectionId,
    },
  });

  if (!collections) return null;

  return collections;
};
