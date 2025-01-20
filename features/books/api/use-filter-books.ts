import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

import { StatusType } from "../schemas";
import { bookKeys } from "@/lib/queryKeys";

type UseGetBooksProps = {
  category: string;
  status: StatusType;
};

export const useFilterBooks = ({ category, status }: UseGetBooksProps) => {
  const {
    data: books,
    isPending,
    refetch,
  } = useQuery({
    queryKey: bookKeys.filter({ category, status }),
    queryFn: async () => {
      const response = await client.api.books.filter.$get({
        query: { category, status },
      });

      if (!response.ok) {
        throw new Error("Something went wrong while fetching books");
      }

      const data = await response.json();
      return data.data || [];
    },
    select: (data) =>
      data.map((book) => ({
        ...book,
        uploadedAt: new Date(book?.uploadedAt),
      })),
    staleTime: 1000 * 60 * 5,
  });

  return { books, isPending, refetch };
};
