"use client";

import BookInformationSkeleton from "@/components/skeletons/book-information-sekelton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { useBookReaderModal } from "../hooks/use-book-reader-modal";
import { useGetBook } from "../api/use-get-book";
import { useEffect } from "react";
import { useBookStore } from "../store/book-store";

type BookInfoProps = {
  bookId: string;
};

export default function BookInformation({ bookId }: BookInfoProps) {
  const { book, isPending } = useGetBook({ bookId });
  const { open } = useBookReaderModal();
  const { setBookId } = useBookStore();

  useEffect(() => {
    if (bookId) {
      setBookId(bookId);
    }
  }, [bookId, setBookId]);

  if (isPending) {
    return <BookInformationSkeleton />;
  }

  if (!book) {
    return <div>No book found</div>;
  }

  return (
    <div className="min-h-screen bg-background p-2">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <Card className="overflow-hidden h-fit">
            <img
              src={book.coverImage ?? ""}
              alt="Untold Secrets: Fire & Ice Book Cover"
              className="w-full object-cover"
              height={450}
              width={300}
            />
          </Card>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold font-georgia">{book.title}</h1>
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
                    {book.categories}
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
