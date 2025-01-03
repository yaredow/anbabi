import { InferRequestType, InferResponseType } from "hono";
import { useMutation } from "@tanstack/react-query";

import { toast } from "@/hooks/use-toast";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.books)["upload"]["$post"],
  200
>;

type RequestType = InferRequestType<
  (typeof client.api.books)["upload"]["$post"]
>;

export const useUploadBook = () => {
  const {
    mutate: upload,
    status,
    error,
  } = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.books.upload.$post({ json });

      if (!response.ok) {
        throw new Error("Something happened while uploading");
      }

      const data = await response.json();

      return data.data as ResponseType;
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error.message || "Something went wrong during the upload.",
      });
    },
  });
  return { upload, status, error };
};
