import { toast } from "@/hooks/use-toast";
import { client } from "@/lib/hono";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.books.upload)["$post"],
  200
>;

type RequestType = {
  json: InferRequestType<(typeof client.api.books.upload)["$post"]>;
  onProgress?: (progress: number) => void;
};

export const useUploadBook = () => {
  const {
    mutate: upload,
    status,
    error,
  } = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, onProgress }) => {
      const response = await client.api.books.upload.$post({
        json,
      });

      if (!response.ok) {
        throw new Error("Something happened while uploading");
      }

      const reader = response.body?.getReader();
      const contentLength = response.headers.get("Content-Length");
      let loaded = 0;

      if (reader && contentLength) {
        const total = parseInt(contentLength, 10);

        // create a stream reader to track progress
        const progressStream = new ReadableStream({
          start(controller) {
            reader.read().then(function push({ done, value }) {
              if (done) {
                controller.close();
                return;
              }

              loaded += value.length;
              const progress = Math.round((loaded / total) * 100);

              // Call the onProgress callback if provided
              if (onProgress) {
                onProgress(progress);
              }

              controller.enqueue(value);
              reader.read().then(push);
            });
          },
        });

        const responseClone = new Response(progressStream);
        await responseClone.text();
      }

      const data = await response.json();
      return data;
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
