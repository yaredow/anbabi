import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { StatusType } from "@prisma/client";

type UseGetBooksByStatusProps = {
  status: StatusType;
};

export const useGetBooksByStatus = ({ status }: UseGetBooksByStatusProps) => {
  const { data: books, isLoading } = useQuery({
    queryKey: ["books", status],
    queryFn: async () => {
      const response = await client.api.books.libraries.$get({
        query: { status },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }

      const data = await response.json();
      return data.data;
    },
  });

  return { books, isLoading };
};
