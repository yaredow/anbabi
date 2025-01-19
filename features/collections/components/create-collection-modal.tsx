"use client";

import ResponsiveModal from "@/components/responsive-modal";

import { useCreateCollectionModal } from "../hooks/use-create-collection-modal";
import CreateCollectionWrapper from "./create-collection-wrapper";

export default function BookReaderModal() {
  const { isOpen, setIsOpen, close } = useCreateCollectionModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateCollectionWrapper onCancel={close} />
    </ResponsiveModal>
  );
}
