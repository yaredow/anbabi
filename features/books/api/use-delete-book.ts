import { client } from "@/lib/hono";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.books)[":bookId"]["$delete"]
>;

type RequestType = InferRequestType<
  (typeof client.api.books)[":bookId"]["$delete"]
>;

export const useDeleteBook = () => {
  const { mutate: deleteBook, isPending } = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({ param }) => {
      const response = await client.api.books[":bookId"].$delete({
        param,
      });

      if (!response.ok) {
        throw new Error("An error occurred");
      }

      return await response.json();
    },
  });

  return { deleteBook, isPending };
};
