"use client";

import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { useGetBook } from "../api/use-get-book";

type BookInfoProps = {
  bookId: string;
};

export default function BookInfo({ bookId }: BookInfoProps) {
  const { book, isPending } = useGetBook({ bookId });
  const [isExpanded, setIsExpanded] = useState(false);

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

          <ScrollArea className={`${isExpanded ? "h-64" : "h-32"} mb-4`}>
            <p className="text-gray-700">{book.description}</p>
          </ScrollArea>
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full justify-center"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" /> Show Less
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" /> Show More
              </>
            )}
          </Button>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
            <dt className="text-sm font-medium text-gray-500">Publisher</dt>
            <dd className="text-sm text-gray-900">{book.publisher}</dd>
            <dt className="text-sm font-medium text-gray-500">
              Publication Date
            </dt>
            <dd className="text-sm text-gray-900">{book.publicationDate}</dd>
            <dt className="text-sm font-medium text-gray-500">ISBN</dt>
            <dd className="text-sm text-gray-900">{book.isbn}</dd>
            <dt className="text-sm font-medium text-gray-500">Category</dt>
            <dd className="text-sm text-gray-900">{book.category}</dd>
            <dt className="text-sm font-medium text-gray-500">Genre</dt>
            <dd className="text-sm text-gray-900">{book.genre}</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
