"use client";

import ResponsiveModal from "@/components/responsive-modal";
import { useUploadBookModal } from "../hooks/use-upload-book-modal";
import EpubUploader from "./ebook-uploader";

export default function UploadBookModal() {
  const { isOpen, setIsOpen, close } = useUploadBookModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <EpubUploader onCancel={close} />
    </ResponsiveModal>
  );
}
