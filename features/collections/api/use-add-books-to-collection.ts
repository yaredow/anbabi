import { client } from "@/lib/hono";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.collections)[":collectionId"]["books"]["$post"],
  200
>;

type RequestType = InferRequestType<
  (typeof client.api.collections)[":collectionId"]["books"]["$post"]
>;

export const useAddBooksToCollection = () => {
  const { mutate: addBooksToCollection, isPending } = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.collections[
        ":collectionId"
      ].books.$post({ json, param });

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

  return { addBooksToCollection, isPending };
};
