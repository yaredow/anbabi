"use client";

import { useGetBook } from "@/features/books/api/use-get-book";
import BookInfo from "@/features/books/components/book-info";
import { ChevronLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type BookDetailPageProps = {
  params: {
    bookId: string;
  };
};

export default function BookDetailPage({ params }: BookDetailPageProps) {
  const { book, isPending } = useGetBook({ bookId: params.bookId });

  if (isPending) {
    return (
      <Loader2 className="flex items-center justify-center mx-auto animate-spin" />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Shelf
          </Link>
          <Image
            src={book?.coverImage}
            alt={`Cover of ${book?.title}`}
            width={400}
            height={600}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{book?.title}</h1>
          <h2 className="text-xl text-gray-600 mb-4">{book?.author}</h2>

          <BookInfo book={book} />
        </div>
      </div>
    </div>
  );
}
