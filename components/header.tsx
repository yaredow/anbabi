"use client";

import { ArrowLeft, Plus, Search } from "lucide-react";
import { Button } from "./ui/button";
import { useUploadBookModal } from "@/features/books/hooks/use-upload-book-modal";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useBookId } from "@/features/books/hooks/use-book-id";
import { useGetBook } from "@/features/books/api/use-get-book";
import BookActionsDropdownMenu from "@/features/books/components/book-actions-dropdown-menu";

export default function Header() {
  const bookId = useBookId();
  const { open } = useUploadBookModal();
  const pathName = usePathname();
  const isHome = pathName === "/";

  const { book } = useGetBook({ bookId });

  return (
    <header className="flex z-20 w-full bg-muted sticky top-0 items-center justify-between h-12 px-4 py-2">
      {isHome ? (
        <Button onClick={open} variant="ghost">
          <Plus className="size-6" />
        </Button>
      ) : (
        <Link
          href="/"
          className="inline-flex gap-2 items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Library</span>
        </Link>
      )}
      <div className="flex items-center gap-4">
        <h1 className="text-sm">{isHome ? "Library" : book?.title}</h1>
      </div>
      {isHome ? (
        <Button variant="ghost">
          <Search className="size-6" />
        </Button>
      ) : (
        <BookActionsDropdownMenu />
      )}
    </header>
  );
}
