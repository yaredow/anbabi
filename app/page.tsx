"use client";

import { useUploadBookModal } from "@/features/books/hooks/use-upload-book-modal";
import BookShelf from "@/components/book-shelf";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import { BooksGrid } from "@/features/books/components/books-grid";

export default function Home() {
  const { open } = useUploadBookModal();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Books</h1>
          <Button onClick={open}>Upload book</Button>
        </div>
        <BooksGrid />
      </main>
    </div>
  );
}
