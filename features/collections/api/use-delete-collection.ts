import { client } from "@/lib/hono";
import { useMutation } from "@tanstack/react-query";

export const useDeleteCollection = () => {
  const { mutate: deleteCollection, isPending } = useMutation({
    mutationFn: async (collectionId: string) => {
      const response = await client.api.collections["collections"][
        ":collectionId"
      ].$delete({
        param: { collectionId },
      });

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
  return { deleteCollection, isPending };
};
