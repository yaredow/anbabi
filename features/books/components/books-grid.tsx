"use client";

import { useGetBooks } from "../api/use-get-books";
import BookCard from "./book-card";
import BooksGridSkeleton from "@/components/skeletons/books-grid-skeleton";

type BooksGridProps = {
  categoryName: string;
};

export function BooksGrid({ categoryName }: BooksGridProps) {
  const { books, isPending } = useGetBooks({ category: categoryName });

  if (isPending) {
    return <BooksGridSkeleton />;
  }

  if (!books || books?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg">
        <div className="text-xl font-semibold text-gray-800 mb-4">
          No Books on Your Shelf
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Start by uploading your first eBook!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
      {books.map((book) => (
        <BookCard
          key={book.id}
          id={book.id ?? ""}
          progress={10}
          author={book.author ?? ""}
          coverUrl={book.coverImage}
          title={book.title ?? ""}
        />
      ))}
    </div>
  );
}
