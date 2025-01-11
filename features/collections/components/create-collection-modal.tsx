"use client";

import ResponsiveReaderModal from "@/components/responsive-reader-modal";
import CreateCollectionForm from "./create-collection-form";
import { useCreateCollectionModal } from "../hooks/use-create-collection-modal";

export default function BookReaderModal() {
  const { isOpen, setIsOpen, close } = useCreateCollectionModal();

  return (
    <ResponsiveReaderModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateCollectionForm onCancel={close} />
    </ResponsiveReaderModal>
  );
}
