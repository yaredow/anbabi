import { useQuery } from "@tanstack/react-query";
import { bookKeys } from "@/lib/queryKeys";
import { client } from "@/lib/hono";

type UseSearchBooksProps = {
  query: string;
};

export const useSearchBooks = ({ query }: UseSearchBooksProps) => {
  const {
    data: books,
    isPending,
    refetch,
  } = useQuery({
    queryKey: bookKeys.search(query),
    queryFn: async () => {
      const response = await client.api.books.search.$get({ query: { query } });

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

  return { books, isPending, refetch };
};
