"use client";

import ResponsiveModal from "@/components/responsive-modal";
import { useAddBooksToCollectionModal } from "../hooks/use-add-books-to-collection-modal";
import AddBooksToCollection from "./add-books-to-collection";

export default function AddBooksToCollectionModal() {
  const { isOpen, setIsOpen, close } = useAddBooksToCollectionModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <AddBooksToCollection onClose={close} />
    </ResponsiveModal>
  );
}
