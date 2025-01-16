import { client } from "@/lib/hono";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.collections)["collections"][":collectionId"]["$patch"]
>;

type RequestType = InferRequestType<
  (typeof client.api.collections)["collections"][":collectionId"]["$patch"]
>;

export const useUpdateCollection = () => {
  const { mutate: updateCollection, isPending } = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.collections["collections"][
        ":collectionId"
      ].$patch({
        json,
        param,
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

  return { updateCollection, isPending };
};
