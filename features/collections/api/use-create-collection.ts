import { client } from "@/lib/hono";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.collections.$post>;

type RequestType = InferRequestType<typeof client.api.collections.$post>;

export const useCreateCollection = () => {
  const { mutate: createCollection, isPending } = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({ json }) => {
      const response = await client.api.collections.$post({ json });

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

  return { createCollection, isPending };
};
