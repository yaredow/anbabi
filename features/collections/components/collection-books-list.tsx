"use client";

import Image from "next/image";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Book } from "@prisma/client";
import Link from "next/link";
import { RiAddCircleFill } from "react-icons/ri";

type CollectionBooksListProps = {
  books: Book[];
  collectionName: string;
};

export default function CollectionBooksList({
  books,
  collectionName,
}: CollectionBooksListProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{collectionName}</h2>
        <RiAddCircleFill className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" />
      </div>

      <ul className="space-y-4">
        {books.map((book) => (
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
                <DropdownMenuItem onClick={() => {}}>
                  Remove from collection
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        ))}
      </ul>
    </>
  );
}
