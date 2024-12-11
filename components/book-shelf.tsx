"use client";

import { useGetBooks } from "@/features/books/api/use-get-books";
import { Loader2 } from "lucide-react";
import BookCard from "../features/books/components/book-card";

export default function BookShelf() {
  const { books, isPending } = useGetBooks();

  if (isPending) {
    return (
      <Loader2 className="flex mx-auto min-h-screen items-center justify-center animate-spin" />
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {books && books.length > 0 ? (
        books.map((book) => (
          <BookCard
            key={book.id}
            coverImage={book.coverImage}
            title={book.title || ""}
          />
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-xl text-muted-foreground">
            No books on your shelf yet. Upload some books to get started!
          </p>
        </div>
      )}
    </div>
  );
}
