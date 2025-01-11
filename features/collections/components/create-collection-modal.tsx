"use client";

import CreateCollectionForm from "./create-collection-form";
import ResponsiveModal from "@/components/responsive-modal";

import { useCreateCollectionModal } from "../hooks/use-create-collection-modal";

export default function BookReaderModal() {
  const { isOpen, setIsOpen, close } = useCreateCollectionModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateCollectionForm onCancel={close} />
    </ResponsiveModal>
  );
}
