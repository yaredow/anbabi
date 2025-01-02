"use client";

import ResponsiveReaderModal from "@/components/responsive-reader-modal";

import { useBookReaderModal } from "../hooks/use-book-reader-modal";
import BookReader from "./book-reader";

export default function BookReaderModal() {
  const { isOpen, setIsOpen } = useBookReaderModal();

  return (
    <ResponsiveReaderModal open={isOpen} onOpenChange={setIsOpen}>
      <BookReader />
    </ResponsiveReaderModal>
  );
}
