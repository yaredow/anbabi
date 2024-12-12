"use client";

import Link from "next/link";
import { Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGetBook } from "../api/use-get-book";

type BookInfoProps = {
  bookId: string;
};

export default function BookInfo({ bookId }: BookInfoProps) {
  const { book, isPending } = useGetBook({ bookId });

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
              <h1 className="text-4xl font-bold">Untold Secrets: Fire & Ice</h1>
              <p className="text-xl text-muted-foreground">by Zabrina Murray</p>
            </div>

            <div>
              <Button size="lg">Read</Button>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <p>
                Arrianna Williams is an ordinary 25 yr. old woman or so she
                thinks. She has stumbled across a very special book and she soon
                sees just how special this book really is or at least she thinks
                she knows. The book comes to life and Arrianna is no longer
                reading the pages but is in the story herself.
              </p>
              <p>
                Shortly after reading the book she runs into an old childhood
                friend Damian. She quickly falls for him but it doesn't last
                long. Hurt; she finds comfort in another man. Thinking her life
                is completely normal, she soon finds out she has a special gift
                that puts her life in danger.
              </p>
              <p>
                An Archangel named Gabriel comes to her rescue but in turn
                things only get worse. She is now being hunted for her gift and
                the man she sought comfort with is in desperate need of her to
                save his life. Meanwhile her feelings for Gabriel grow stronger
                as she wonders if he could be her true love. Could this Angel
                ever love her the way she loves him? Will she defeat the fallen
                angel and demons after her? So many secrets so many lies and so
                much heartache will happen during her journey to discovering who
                she really is and what she was meant to do.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Book Details</h3>
                  <div className="text-sm text-muted-foreground">168 pages</div>
                </div>
                <div>
                  <h3 className="font-semibold">Publisher</h3>
                  <div className="text-sm text-muted-foreground">
                    Self-Published
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Publication Date</h3>
                  <div className="text-sm text-muted-foreground">2012</div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Language</h3>
                  <div className="text-sm text-muted-foreground">English</div>
                </div>
                <div>
                  <h3 className="font-semibold">ISBN</h3>
                  <div className="text-sm text-muted-foreground">
                    1479174661
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Genre</h3>
                  <div className="text-sm text-muted-foreground">
                    Fantasy, Romance
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
