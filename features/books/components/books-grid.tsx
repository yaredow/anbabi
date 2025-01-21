"use client";

import { useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import { useQueryState } from "nuqs";

import { statusMapping } from "@/lib/utils";

import BooksGridSkeleton from "@/components/skeletons/books-grid-skeleton";

import { useFilterBooks } from "../api/use-filter-books";
import { useCategoryName } from "../hooks/use-category-name";
import { StatusType } from "../schemas";
import BookCard from "./book-card";
import { useBookStatus } from "../hooks/use-book-status";

export function BooksGrid() {
  const status = useBookStatus();
  const mappedStatus = status ? statusMapping[status.toLowerCase()] : undefined;

  const categoryName = useCategoryName();

  const [searchQuery] = useQueryState("query");

  const { books, isFetching, refetch } = useFilterBooks({
    status: mappedStatus as StatusType,
    category: categoryName!,
    query: searchQuery || "",
  });

  const debounceRefetch = useCallback(
    debounce(() => refetch(), 400),
    [refetch],
  );

  useEffect(() => {
    debounceRefetch();
    return () => debounceRefetch.cancel();
  }, [categoryName, status, searchQuery, debounceRefetch]);

  if (!books || books.length === 0) {
    let noBooksMessage = `No books available`;

    if (searchQuery) {
      noBooksMessage += ` matching "${searchQuery}"`;
    }

    if (categoryName && categoryName !== "all") {
      noBooksMessage += ` in category: ${categoryName}`;
    }

    if (status) {
      noBooksMessage += ` with status: ${status}`;
    }

    return (
      <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg">
        <div className="text-xl font-semibold text-gray-800 mb-4">
          {noBooksMessage}
        </div>
        {categoryName === "all" && !searchQuery && (
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
