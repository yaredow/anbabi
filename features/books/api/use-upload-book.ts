import { toast } from "@/hooks/use-toast";
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
        throw new Error("Something happened while uploading");
      }

      return await response.json();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error.message || "Something went wrong during the upload.",
      });
    },
  });

  return { upload, status };
};
