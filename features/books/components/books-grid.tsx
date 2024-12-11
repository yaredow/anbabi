"use client";

import Link from "next/link";
import { BookCard } from "./book-card";
import { useGetBooks } from "../api/use-get-books";
import { Book } from "@prisma/client";
import { Loader2 } from "lucide-react";

export function BooksGrid() {
  const { books, isPending } = useGetBooks();

  if (isPending) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {" "}
      {!books?.length ? (
        <p className="col-span-full text-center text-muted-foreground">
          No books found.
        </p>
      ) : (
        books.map((book, index) => (
          <BookLink key={book.id} priority={index < 10} book={book} />
        ))
      )}
    </div>
  );
}

type BookLinkProps = {
  book: Book;
};

function BookLink({ book }: BookLinkProps) {
  return (
    <Link
      href={`/${book.id}`}
      className="block transform transition-transform ease-in-out hover:scale-105"
    >
      <BookCard src={book.coverImage} title={book.title} />
    </Link>
  );
}
