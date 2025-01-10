import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

import { BooksCount } from "../types";

export const useGetCategoriesCount = () => {
  const { data: count, isPending } = useQuery<BooksCount>({
    queryKey: ["counts"],
    queryFn: async () => {
      const response = await client.api.books.categories.count.$get();

      if (!response.ok) {
        throw new Error("Something went wrong while fetching books");
      }

      const data = await response.json();
      return data.data;
    },
  });

  return { count, isPending };
};
