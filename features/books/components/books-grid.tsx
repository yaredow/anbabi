"use client";

import Image from "next/image";
import { useGetBooks } from "../api/use-get-books";
import { Loader2 } from "lucide-react";
import BookCard from "./book-card";

export function BooksGrid() {
  const { books, isPending } = useGetBooks();

  if (isPending) {
    return (
      <Loader2 className="animate-spin flex items-center justify-center mx-auto" />
    );
  }

  if (!books) {
    return <div>There are no books available</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {books.map((book) => (
        <BookCard
          key={book.id}
          id={book.id!}
          progress={10}
          author={book.author!}
          coverUrl={book.coverImage}
          title={book.title || ""}
        />
      ))}
    </div>
  );
}
