import { client } from "@/lib/hono";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.accounts)["update-profile"]["$post"]
>;

type RequestType = InferRequestType<
  (typeof client.api.accounts)["update-profile"]["$post"]
>;

export const useUpdateUserProfile = () => {
  const { mutate: updateProfile, isPending } = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({ form }) => {
      const response = await client.api.accounts["update-profile"].$post({
        form,
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

  return { updateProfile, isPending };
};
