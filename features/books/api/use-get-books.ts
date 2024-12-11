import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetBooks = () => {
  const { data: books, isPending } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const response = await client.api.books.$get();

      if (!response.ok) {
        throw new Error("Something went wrong while fetching books");
      }

      const data = await response.json();
      return data.data;
    },
    select: (data) =>
      data.map((book) => ({
        ...book,
        uploadedAt: new Date(book.uploadedAt),
      })),
  });

  return { books, isPending };
};
