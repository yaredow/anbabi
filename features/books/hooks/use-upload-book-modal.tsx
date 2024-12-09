"use client";

import { parseAsBoolean, useQueryState } from "nuqs";

export const useUploadBookModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "upload-book",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }),
  );

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    open,
    close,
    isOpen,
    setIsOpen,
  };
};
