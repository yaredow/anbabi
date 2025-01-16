import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

type UseGetCollectionProps = {
  collectionId: string;
};

export const useGetCollection = ({ collectionId }: UseGetCollectionProps) => {
  const { data: collection, isPending } = useQuery({
    queryKey: ["collection", collectionId],
    queryFn: async () => {
      const response = await client.api.collections[":collectionId"].$get({
        param: { collectionId },
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
      return data.data;
    },
    enabled: !!collectionId,
  });

  return { collection, isPending };
};
