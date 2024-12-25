import { client } from "@/lib/hono";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType } from "hono";
import { Role } from "../types";

type ApiResponse = {
  data: { role: Role; content: string };
};

type TransformedResponse = {
  role: Role;
  content: string;
};

type RequestType = InferRequestType<
  (typeof client.api.assistants)["ask-ai"]["$post"]
>;

export const useAskAI = () => {
  const { mutate: chat, isPending } = useMutation<
    TransformedResponse,
    Error,
    RequestType
  >({
    mutationFn: async ({ json }) => {
      const response = await client.api.assistants["ask-ai"].$post({
        json,
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = (await response.json()) as ApiResponse;

      return {
        role: data.data.role,
        content: data.data.content,
      };
    },
  });

  return { chat, isPending };
};
