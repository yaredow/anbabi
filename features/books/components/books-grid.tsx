"use client";

import { useCallback, useEffect } from "react";
import { useGetBooks } from "../api/use-get-books";
import BookCard from "./book-card";
import BooksGridSkeleton from "@/components/skeletons/books-grid-skeleton";
import { debounce } from "lodash";

type BooksGridProps = {
  categoryName: string;
};

export function BooksGrid({ categoryName }: BooksGridProps) {
  const { books, isPending, refetch } = useGetBooks({ category: categoryName });

  const debounceRefetch = useCallback(
    debounce(() => refetch(), 400),
    [refetch],
  );

  useEffect(() => {
    debounceRefetch();

    return () => debounceRefetch.cancel();
  }, [categoryName, debounceRefetch]);

  if (isPending) {
    return <BooksGridSkeleton />;
  }

  if (!books || books?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg">
        <div className="text-xl font-semibold text-gray-800 mb-4">
          {categoryName === "all"
            ? "No book on your shelf"
            : `No books available in category: ${categoryName}`}
        </div>
        {categoryName === "all" && (
          <p className="text-sm text-gray-500 mb-6">
            Start by uploading your first eBook!
          </p>
        )}
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
