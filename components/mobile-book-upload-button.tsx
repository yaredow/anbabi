"use client";

import { useUploadBookModal } from "@/features/books/hooks/use-upload-book-modal";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";

export default function MobileBookUploadButton() {
  const { open } = useUploadBookModal();

  return (
    <Button
      className="fixed bottom-4 right-4 rounded-full p-0 w-12 h-12 hover:bg-primary/90 shadow-lg md:hidden"
      aria-label="Upload book"
      onClick={open}
    >
      <Plus className="size-6" />
    </Button>
  );
}
