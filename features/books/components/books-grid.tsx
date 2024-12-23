"use client";

import Link from "next/link";
import { useGetBooks } from "../api/use-get-books";
import { Book } from "@prisma/client";
import { Loader2 } from "lucide-react";
import BookCard from "./book-card";

export function BooksGrid() {
  const { books, isPending } = useGetBooks();

  if (isPending) {
    return (
      <Loader2 className="animate-spin flex items-center justify-center mx-auto" />
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {!books?.length ? (
        <p className="col-span-full text-center text-muted-foreground">
          No book available on your shelf. Upload and read
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
    <Link href={`/${book.id}`} className="block">
      <BookCard src={book.coverImage || ""} title={book.title} />
    </Link>
  );
}
