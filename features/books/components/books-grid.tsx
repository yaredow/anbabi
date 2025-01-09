"use client";

import { useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import { useGetBooks } from "../api/use-get-books";
import BooksGridSkeleton from "@/components/skeletons/books-grid-skeleton";
import BookCard from "./book-card";
import { StatusType } from "../schemas";
import { statusMapping } from "@/lib/utils";

interface BooksGridProps {
  categoryName?: string;
  status?: string;
}

export function BooksGrid({ categoryName, status }: BooksGridProps) {
  const mappedStatus = status ? statusMapping[status.toLowerCase()] : undefined;

  const { books, isPending, refetch } = useGetBooks({
    status: mappedStatus as StatusType,
    category: categoryName!,
  });

  const debounceRefetch = useCallback(
    debounce(() => refetch(), 400),
    [refetch],
  );

  useEffect(() => {
    debounceRefetch();
    return () => debounceRefetch.cancel();
  }, [categoryName, status, debounceRefetch]);

  if (isPending) {
    return <BooksGridSkeleton />;
  }

  if (!books || books.length === 0) {
    const noBooksMessage =
      categoryName === "all"
        ? "No book on your shelf"
        : status
          ? `No books available in library: ${status}`
          : `No books available in category: ${categoryName}`;

    return (
      <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg">
        <div className="text-xl font-semibold text-gray-800 mb-4">
          {noBooksMessage}
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
      {books?.map((book) => (
        <BookCard
          key={book.id}
          id={book.id ?? ""}
          progress={10}
          author={book.author ?? ""}
          coverUrl={book.coverImage ?? ""}
          title={book.title ?? ""}
        />
      ))}
    </div>
  );
}
