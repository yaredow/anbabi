import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

import { StatusType } from "../schemas";
import { bookKeys } from "@/lib/queryKeys";

type UseGetBooksProps = {
  category: string;
  status: StatusType;
  query: string;
};

export const useFilterBooks = ({
  category,
  status,
  query: searchQuery,
}: UseGetBooksProps) => {
  const {
    data: books,
    isFetching,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: bookKeys.filter({ category, status, searchQuery }),
    queryFn: async () => {
      const response = await client.api.books.filter.$get({
        query: { category, status, query: searchQuery },
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
    select: (data) =>
      data.map((book) => ({
        ...book,
        uploadedAt: new Date(book?.uploadedAt),
      })),
    staleTime: 1000 * 60 * 5,
  });

  return { books, isFetching, isPending, error, refetch };
};
