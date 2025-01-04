import { client } from "@/lib/hono";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.books)["status"][":bookId"]["$patch"]
>;

type RequestType = InferRequestType<
  (typeof client.api.books)["status"][":bookId"]["$patch"]
>;

export const useChangeBookStatus = () => {
  const { mutate: changeStatus, isPending } = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({ query, param }) => {
      const response = await client.api.books.status[":bookId"].$patch({
        query,
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to change book status");
      }

      return await response.json();
    },
  });

  return { changeStatus, isPending };
};
