"use client";

import { useGetBooks } from "@/features/books/api/use-get-books";
import { BooksGrid } from "@/features/books/components/books-grid";
import BookCardSkeleton from "./skeletons/book-card-skeleton";

export default function Home() {
  const { books, isPending } = useGetBooks();

  if (!books || books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg">
        <div className="text-xl font-semibold text-gray-800 mb-4">
          No books available. Start by uploading
        </div>
      </div>
    );
  }

  return (
    <main>
      <BooksGrid books={books} isPending={isPending} />
    </main>
  );
}
