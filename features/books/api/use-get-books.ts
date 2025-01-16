import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetBooks = () => {
  const { data: books, isPending } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const response = await client.api.books.$get();

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
        uploadedAt: new Date(book.uploadedAt),
      })),
  });

  return { books, isPending };
};
