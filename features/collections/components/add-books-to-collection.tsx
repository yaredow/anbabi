"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Check } from "lucide-react";
import { Book } from "@prisma/client";
import { useGetBooks } from "@/features/books/api/use-get-books";
import { useAddBooksToCollection } from "../api/use-add-books-to-collection";
import { useCollectionId } from "../hooks/useCollectionId";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

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

type AddBooksToCollectionProps = {
  onClose: () => void;
};

export default function AddBooksToCollection({
  onClose,
}: AddBooksToCollectionProps) {
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const collectionId = useCollectionId();
  const queryClient = useQueryClient();

  const { books, isPending: isGetBooksPending } = useGetBooks();
  const { addBooksToCollection, isPending: isAddBookToCollectionPending } =
    useAddBooksToCollection();

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
    addBooksToCollection(
      {
        json: {
          bookIds: Array.from(selectedBooks),
        },
        param: { collectionId },
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: ["collection", collectionId],
          });
          toast({
            description: data.message,
          });
          onClose();
        },
      },
    );
    setSelectedBooks(new Set());
  };

  return (
    <div className="sm:max-w-[500px] p-4">
      <div className="p-4">
        <h3 className="text-lg font-semibold">Add Books to Collection</h3>
      </div>

      <div className="mt-4 h-[400px] overflow-auto">
        {books?.map((book) => (
          <BookItem
            key={book.id}
            book={book}
            isSelected={selectedBooks.has(book.id)}
            onToggle={() => toggleBook(book.id)}
          />
        ))}
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleAddBooks}
          disabled={isAddBookToCollectionPending || selectedBooks.size === 0}
        >
          Add Books ({selectedBooks.size})
        </Button>
      </div>
    </div>
  );
}
