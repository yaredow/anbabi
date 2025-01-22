import { Book } from "@prisma/client";
import BookCard from "./book-card";

type BooksGridProps = {
  books: Book[];
};

export function BooksGrid({ books }: BooksGridProps) {
  if (!books || books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg">
        <div className="text-xl font-semibold text-gray-800 mb-4">
          No books available
        </div>
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
          coverUrl={book.coverImage ?? ""}
          title={book.title ?? ""}
        />
      ))}
    </div>
  );
}
