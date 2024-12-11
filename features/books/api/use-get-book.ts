import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

type UseGetBookProps = {
  bookId: string;
};

export const useGetBook = ({ bookId }: UseGetBookProps) => {
  const { data: book, isPending } = useQuery({
    queryKey: ["bookDetails", bookId],
    queryFn: async () => {
      const response = await client.api.books[":bookId"].$get({
        param: { bookId },
      });

      if (!response.ok) {
        throw new Error("Something went wrong while fetching the book");
      }

      const data = await response.json();
      return data.data;
    },
  });

  return { book, isPending };
};
