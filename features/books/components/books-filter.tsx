"use client";

import { useCallback, useEffect } from "react";
import { statusMapping } from "@/lib/utils";
import { useQueryState } from "nuqs";
import { debounce } from "lodash";

import { useCategoryName } from "../hooks/use-category-name";
import { useBookStatus } from "../hooks/use-book-status";
import { useFilterBooks } from "../api/use-filter-books";
import { BooksGrid } from "./books-grid";
import { StatusType } from "../schemas";

export function BooksFilter() {
  const status = useBookStatus();
  const mappedStatus = status ? statusMapping[status.toLowerCase()] : undefined;

  const categoryName = useCategoryName();

  const [searchQuery] = useQueryState("query");

  const { books, isPending, refetch } = useFilterBooks({
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

  return <BooksGrid books={books} isPending={isPending} />;
}
