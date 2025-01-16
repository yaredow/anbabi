import { client } from "@/lib/hono";
import { useMutation } from "@tanstack/react-query";

type RequestType = {
  collectionId: string;
  bookId: string;
};

export const useRemoveBookFromCollection = () => {
  const { mutate: removeBookFromCollection, isPending } = useMutation({
    mutationFn: async ({ collectionId, bookId }: RequestType) => {
      const response = await client.api.collections[":collectionId"]["books"][
        ":bookId"
      ].$delete({ param: { collectionId, bookId } });

      if (!response.ok) {
        const errorData = await response.json();
        if ("error" in errorData) {
          throw new Error(errorData.error);
        } else {
          throw new Error("An unknown error occurred");
        }
      }

      const data = await response.json();
      return data;
    },
  });

  return { removeBookFromCollection, isPending };
};
