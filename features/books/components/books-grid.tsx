import { Book } from "@prisma/client";
import BookCard from "./book-card";
import BooksGridSkeleton from "@/components/skeletons/books-grid-skeleton";

type BooksGridProps = {
  books: Book[];
  isPending: boolean;
};

export function BooksGrid({ books, isPending }: BooksGridProps) {
  if (isPending) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {Array.from({ length: 10 }, (_, i) => (
          <BooksGridSkeleton key={i} />
        ))}
      </div>
    );
  }

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
          bookUrl={book.coverImage as string}
          id={book.id}
          title={book.title}
          progress={10}
          key={book.id}
        />
      ))}
    </div>
  );
}
