import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetCollections = () => {
  const { data: collections, isPending } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const response = await client.api.collections.$get();

      if (!response.ok) {
        const errorData = await response.json();
        if ("error" in errorData) {
          throw new Error(errorData.error);
        } else {
          throw new Error("An unknown error occurred");
        }
      }

      const data = await response.json();
      return data.data;
    },
  });

  return { collections, isPending };
};
