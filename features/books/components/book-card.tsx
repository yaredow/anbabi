"use client";

import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useBookReaderModal } from "../hooks/use-book-reader-modal";
import { useDeleteBook } from "../api/use-delete-book";
import { useBookId } from "../hooks/use-book-id";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  progress: number;
  coverUrl: string;
  onRemove?: () => void;
}

export default function BookCard({
  id,
  title,
  progress,
  coverUrl,
}: BookCardProps) {
  const { open } = useBookReaderModal();
  const bookId = useBookId();
  console.log({ bookId });
  const { deleteBook, isPending } = useDeleteBook();
  const queryClient = useQueryClient();

  const handleBookDelete = () => {
    deleteBook(
      { param: { bookId } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["books"] });
          toast({
            variant: "destructive",
            description: "Book removed successfully",
          });
        },
      },
    );
  };

  return (
    <div className="group relative w-[180px] bg-background px-4 py-2 cursor-pointer transition-shadow rounded-lg">
      <Link href={`/${id}`}>
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg hover:scale-105">
          <Image
            src={coverUrl}
            alt={`Cover of ${title}`}
            fill
            className="object-cover"
            priority
          />
        </div>
      </Link>

      <div className="p-4 space-y-2">
        <h3 className="font-semibold leading-none text-sm truncate">{title}</h3>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{progress}%</p>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-full">
              <MoreHorizontal className="size-4 font-semibold" />
              <span className="sr-only">Open menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={open}>Open</DropdownMenuItem>
              <DropdownMenuItem onClick={handleBookDelete} disabled={isPending}>
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
