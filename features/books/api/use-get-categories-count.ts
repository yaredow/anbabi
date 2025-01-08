import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type BooksCount = {
  categoryCount: Record<string, number>;
  totalBooks: number;
};

export const useGetCategoriesCount = () => {
  const { data: count, isPending } = useQuery<BooksCount>({
    queryKey: ["category-counts"],
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
