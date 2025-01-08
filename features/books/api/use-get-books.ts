import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type UseGetBooksProps = {
  category: string;
};

export const useGetBooks = ({ category }: UseGetBooksProps) => {
  const {
    data: books,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["books", category],
    queryFn: async () => {
      const response = await client.api.books.$get({ query: { category } });

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
    enabled: !!category,
  });

  return { books, isPending, refetch };
};
