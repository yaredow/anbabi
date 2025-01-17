"use client";

import { FaCirclePlus } from "react-icons/fa6";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAddBooksToCollectionModal } from "../hooks/use-add-books-to-collection-modal";
import { useRemoveBookFromCollection } from "../api/use-remove-book-from-collection";
import { useGetCollection } from "../api/use-get-collection";
import { useCollectionId } from "../hooks/useCollectionId";
import { useConfirm } from "@/hooks/use-confirm";

export default function CollectionBooksList() {
  const queryClient = useQueryClient();
  const collectionId = useCollectionId();
  const router = useRouter();

  const [ConfirmationDialog, confirm] = useConfirm({
    title: "Remove Book and Collection",
    message:
      "Are you sure you want to remove this book from the collection? This will also remove the collection.",
    variant: "destructive",
  });

  const { open } = useAddBooksToCollectionModal();
  const { collection } = useGetCollection({ collectionId });
  const { removeBookFromCollection, isPending } = useRemoveBookFromCollection();

  const handleRemoveBook = (bookId: string) => {
    const lastBook = collection?.books.length === 1;

    const onSuccess = () => {
      queryClient.invalidateQueries({ queryKey: ["collection", collectionId] });
      if (lastBook) {
        queryClient.invalidateQueries({ queryKey: ["collections"] });
        window.location.href = "/";
      }
    };

    if (lastBook) {
      confirm().then((confirmed) => {
        if (confirmed) {
          removeBookFromCollection({ collectionId, bookId }, { onSuccess });
        }
      });
    } else {
      removeBookFromCollection({ collectionId, bookId }, { onSuccess });
    }
  };

  return (
    <>
      <ConfirmationDialog />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{collection?.name}</h2>
        <Button variant="ghost" onClick={open}>
          <FaCirclePlus />
        </Button>
      </div>

      <ul className="space-y-4">
        {collection?.books.map((book) => (
          <li
            key={book.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
          >
            <Link
              href={`/books/${book.id}`}
              className="flex items-center space-x-4"
            >
              <div className="relative w-14 h-20 overflow-hidden rounded">
                <Image
                  src={book.coverImage || ""}
                  alt={`Cover of ${book.title}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{book.title}</h3>
                <p className="text-sm text-gray-500">{book.author}</p>
              </div>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  disabled={isPending}
                  onClick={() => handleRemoveBook(book.id)}
                >
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        ))}
      </ul>
    </>
  );
}
