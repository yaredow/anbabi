"use client";

import { Plus, Search } from "lucide-react";
import { Button } from "./ui/button";
import { useUploadBookModal } from "@/features/books/hooks/use-upload-book-modal";
import { useGetBooks } from "@/features/books/api/use-get-books";

export default function Header() {
  const { open } = useUploadBookModal();

  return (
    <header className="flex z-20 w-full bg-muted sticky top-0 items-center justify-between px-4 py-2">
      <Button onClick={open} variant="ghost">
        <Plus className="size-6" />
      </Button>
      <div className="flex items-center gap-4">
        <h1 className="text-sm">Library</h1>
      </div>
      <Button variant="ghost">
        <Search className="size-6" />
      </Button>
    </header>
  );
}
