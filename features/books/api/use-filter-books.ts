import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

import { StatusType } from "../schemas";

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
    queryKey: ["books", category, status],
    queryFn: async () => {
      const response = await client.api.books.filter.$get({
        query: { category, status },
      });

      if (!response.ok) {
        throw new Error("Something went wrong while fetching books");
      }

      const data = await response.json();
      return data.data;
    },
    select: (data) =>
      data.map((book) => ({
        ...book,
        uploadedAt: new Date(book?.uploadedAt),
      })),
    enabled: !!category || !!status,
  });

  return { books, isPending, refetch };
};
