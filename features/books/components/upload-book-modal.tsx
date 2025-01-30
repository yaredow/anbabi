"use client";

import ResponsiveModal from "@/components/responsive-modal";
import { useUploadBookModal } from "../hooks/use-upload-book-modal";
import BookUploader from "./book-uploader";

export default function UploadBookModal() {
  const { isOpen, setIsOpen, close } = useUploadBookModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <BookUploader onCancel={close} />
    </ResponsiveModal>
  );
}
