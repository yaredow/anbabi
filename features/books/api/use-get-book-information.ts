import { useQuery } from "@tanstack/react-query";

type UseGetBookInformationProps = {
  isbn: string;
};

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_BOOK_API_KEY;

export const useGetBookInformation = ({ isbn }: UseGetBookInformationProps) => {
  const { data: bookInfo, isPending } = useQuery({
    queryKey: ["bookDetails", isbn],
    queryFn: async () => {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${API_KEY}`,
      );

      if (!response.ok) {
        throw new Error("Something went wrong while fetching books");
      }

      const data = await response.json();
      const book = data.items[0].volumeInfo;

      return {
        title: book.title,
        authors: book.authors || [],
        description: book.description || "No description available.",
        coverImage: book.imageLinks?.thumbnail || null,
        publishedDate: book.publishedDate,
        publisher: book.publisher,
        categories: book.categories || [],
      };
    },
  });

  return { bookInfo, isPending };
};
