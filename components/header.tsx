"use client";

import { ArrowLeft, Plus, Search, X } from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import BookActionsDropdownMenu from "@/features/books/components/book-actions-dropdown-menu";
import { useUploadBookModal } from "@/features/books/hooks/use-upload-book-modal";
import { useCategoryName } from "@/features/books/hooks/use-category-name";
import { useGetBook } from "@/features/books/api/use-get-book";
import { useBookId } from "@/features/books/hooks/use-book-id";

import { useBookStatus } from "@/features/books/hooks/use-book-status";

import { Button } from "./ui/button";
import { useState } from "react";
import { SearchBar } from "./search-bar";

export default function Header() {
  const [isSearchOpen, setSearchIsOpen] = useState<boolean>(false);

  const { open } = useUploadBookModal();
  const category = useCategoryName();
  const pathName = usePathname();
  const status = useBookStatus();
  const bookId = useBookId();
  const { book } = useGetBook({ bookId });

  const isHome = ["/", `/category/${category}`, `/library/${status}`].includes(
    pathName,
  );
  const isCollection = pathName.includes("/collections");

  const toggleSearch = () => setSearchIsOpen((prev) => !prev);

  if (isCollection) {
    return null;
  }

  return (
    <header className="flex z-20 w-full bg-background top-0 items-center justify-between h-12 px-4 py-2 relative">
      {isHome ? (
        <Button onClick={open} variant="ghost" className="hidden md:block">
          <Plus className="size-5" />
        </Button>
      ) : (
        <Link
          href="/"
          className="md:inline-flex hidden gap-2 md:items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Library</span>
        </Link>
      )}
      <div className="flex items-center gap-4 flex-grow justify-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
        {isHome ? (
          isSearchOpen ? (
            <SearchBar />
          ) : (
            <h1 className="text-sm">Library</h1>
          )
        ) : (
          <h1 className="text-sm">{book?.title}</h1>
        )}
      </div>
      <div className="flex items-center gap-2">
        {isHome ? (
          <Button
            variant="ghost"
            onClick={toggleSearch}
            className="ml-auto md:ml-0"
          >
            {isSearchOpen ? (
              <X className="size-5" />
            ) : (
              <Search className="size-5" />
            )}
          </Button>
        ) : (
          <BookActionsDropdownMenu />
        )}
      </div>
    </header>
  );
}
