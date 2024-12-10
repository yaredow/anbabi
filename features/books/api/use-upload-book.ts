import { client } from "@/lib/hono";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.books.upload)["$post"],
  200
>;

type RequestType = InferRequestType<(typeof client.api.books.upload)["$post"]>;

export const useUploadBook = () => {
  const { mutate: upload, status } = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({ json }) => {
      const response = await client.api.books.upload.$post({ json });

      if (!response.ok) {
        throw new Error("Something happened while uplaoding");
      }

      return await response.json();
    },
  });

  return { upload, status };
};
