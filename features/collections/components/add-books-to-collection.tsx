"use client";

import { FaCirclePlus } from "react-icons/fa6";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Check } from "lucide-react";
import { Book } from "@prisma/client";
import { useGetBooks } from "@/features/books/api/use-get-books";

const BookItem = ({
  book,
  isSelected,
  onToggle,
}: {
  book: Book;
  isSelected: boolean;
  onToggle: () => void;
}) => (
  <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
    <div className="flex items-center space-x-3">
      <Image
        src={book.coverImage || "/placeholder.svg"}
        alt={`Cover of ${book.title}`}
        width={60}
        height={80}
        className="object-cover rounded"
      />
      <div>
        <h3 className="font-semibold">{book.title}</h3>
        <p className="text-sm text-gray-600">{book.author}</p>
      </div>
    </div>
    <Button variant="ghost" size="icon" onClick={onToggle}>
      {isSelected ? (
        <Check className="h-4 w-4" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
    </Button>
  </div>
);

export default function AddBooksToCollection() {
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());

  const { books, isPending } = useGetBooks();

  const toggleBook = (bookId: string) => {
    setSelectedBooks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(bookId)) {
        newSet.delete(bookId);
      } else {
        newSet.add(bookId);
      }
      return newSet;
    });
  };

  const handleAddBooks = () => {
    // Here you would typically send the selected books to your backend
    console.log("Adding books:", Array.from(selectedBooks));
    // Reset selection after adding
    setSelectedBooks(new Set());
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <FaCirclePlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Books to Collection</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-4 h-[400px] pr-4">
          {books?.map((book) => (
            <BookItem
              key={book.id}
              book={book}
              isSelected={selectedBooks.has(book.id)}
              onToggle={() => toggleBook(book.id)}
            />
          ))}
        </ScrollArea>
        <Button
          onClick={handleAddBooks}
          className="mt-4"
          disabled={selectedBooks.size === 0}
        >
          Add Books ({selectedBooks.size})
        </Button>
      </DialogContent>
    </Dialog>
  );
}
