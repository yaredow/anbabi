"use client";

import { Loader2 } from "lucide-react";
import { ReactReader } from "react-reader";
import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { useGetBook } from "../api/use-get-book";
import { useBookReaderModal } from "../hooks/use-book-reader-modal";

type BookInfoProps = {
  bookId: string;
};

export default function BookInfo({ bookId }: BookInfoProps) {
  const { book, isPending } = useGetBook({ bookId });
  const { open } = useBookReaderModal();

  /* const fetchBookFile = async (bookUrl) => {
    const response = await fetch(bookUrl);
    const blob = await response.blob();
    return blob;
  };

  const createObjectUrl = (blob) => {
    return URL.createObjectURL(blob);
  };

  const fetchAndPrepareBook = async (bookUrl) => {
    try {
      const blob = await fetchBookFile(bookUrl);
      const fileUrl = createObjectUrl(blob); // Use this URL in React-Reader
      setBookUrl(fileUrl);
    } catch (error) {
      console.error("Failed to fetch or convert book:", error);
    }
  };

  useEffect(() => {
    fetchAndPrepareBook(book?.bookUrl);
  }, []); */

  if (isPending) {
    return (
      <Loader2 className="flex items-center justify-center h-screen mx-auto animate-spin" />
    );
  }

  if (!book) {
    return <div>No book found</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          ← Back to Books
        </Link>

        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <Card className="overflow-hidden h-fit">
            <img
              src={book.coverImage}
              alt="Untold Secrets: Fire & Ice Book Cover"
              className="w-full object-cover"
              height={450}
              width={300}
            />
          </Card>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold">{book.title}</h1>
              <p className="text-xl text-muted-foreground">{`by ${book.author}`}</p>
            </div>

            <div>
              <Button size="lg" onClick={open}>
                Read
              </Button>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              {book.description}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Book Details</h3>
                  <div className="text-sm text-muted-foreground">{`${book.pageCount ? book.pageCount : "Unknown"} pages`}</div>
                </div>
                <div>
                  <h3 className="font-semibold">Publisher</h3>
                  <div className="text-sm text-muted-foreground">
                    {book.publisher}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Publication Date</h3>
                  <div className="text-sm text-muted-foreground">
                    {book.publicationYear}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Language</h3>
                  <div className="text-sm text-muted-foreground">
                    {book.language}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">ISBN</h3>
                  <div className="text-sm text-muted-foreground">
                    {book.isbn}{" "}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Genre</h3>
                  <div className="text-sm text-muted-foreground">
                    {book.genre}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
