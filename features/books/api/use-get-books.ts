import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetBooks = () => {
  const { data: books, isPending } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const response = await client.api.books.$get();

      if (!response.ok) {
        throw new Error("Something went wrong while  fetching books");
      }

      return await response.json();
    },
  });

  return { books, isPending };
};
