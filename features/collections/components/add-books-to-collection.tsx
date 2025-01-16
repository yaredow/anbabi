"use client";

import { Plus, Check, Loader2, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Book } from "@prisma/client";

import { useGetBooks } from "@/features/books/api/use-get-books";

import { Button } from "@/components/ui/button";

import { useAddBooksToCollection } from "../api/use-add-books-to-collection";
import { useCollectionId } from "../hooks/useCollectionId";
import { useGetCollection } from "../api/use-get-collection";

type BookItemProps = {
  book: Book;
  isSelected: boolean;
  isAlreadyInCollection: boolean;
  onToggle: () => void;
};

const BookItem = ({
  book,
  isSelected,
  isAlreadyInCollection,
  onToggle,
}: BookItemProps) => (
  <div
    className={`flex items-center justify-between p-2 rounded transition-colors duration-200 ${
      isAlreadyInCollection
        ? "bg-gray-100 opacity-50"
        : isSelected
          ? "bg-primary/10 border border-primary"
          : "hover:bg-gray-100"
    }`}
  >
    <div className="flex items-center space-x-3">
      <div className="relative">
        <Image
          src={book.coverImage || "/placeholder.svg"}
          alt={`Cover of ${book.title}`}
          width={60}
          height={80}
          className="object-cover rounded"
        />
        {isAlreadyInCollection && (
          <div className="absolute inset-0 bg-gray-500/50 rounded flex items-center justify-center">
            <X className="text-white w-6 h-6" />
          </div>
        )}
      </div>
      <div>
        <h3 className="font-semibold">{book.title}</h3>
        <p className="text-sm text-gray-600">{book.author}</p>
        {isAlreadyInCollection && (
          <p className="text-xs text-gray-500 mt-1">Already in collection</p>
        )}
      </div>
    </div>

    {!isAlreadyInCollection && (
      <Button
        variant={isSelected ? "secondary" : "ghost"}
        size="icon"
        onClick={onToggle}
        aria-label={
          isSelected
            ? `Remove ${book.title} from selection`
            : `Add ${book.title} to selection`
        }
      >
        {isSelected ? (
          <Check className="h-4 w-4" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>
    )}
  </div>
);

type AddBooksToCollectionProps = {
  onClose: () => void;
};

export default function AddBooksToCollection({
  onClose,
}: AddBooksToCollectionProps) {
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());

  const collectionId = useCollectionId();
  const queryClient = useQueryClient();

  const { books, isPending: isGetBooksPending } = useGetBooks();
  const { collection, isPending: isCollectionPending } = useGetCollection({
    collectionId,
  });
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
        onError: (error) => {
          toast({
            description: error.message,
            variant: "destructive",
          });
        },
      },
    );
    setSelectedBooks(new Set());
  };

  if (isGetBooksPending || isCollectionPending) {
    return (
      <div className="sm:max-w-[500px] p-4">
        <Loader2 className="flex items-center justify-center mx-auto animate-spin" />
      </div>
    );
  }

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
            isAlreadyInCollection={
              collection?.books.some((b) => b.id === book.id) as boolean
            }
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
