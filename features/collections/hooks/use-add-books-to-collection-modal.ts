"use client";

import { parseAsBoolean, useQueryState } from "nuqs";

export const useAddBooksToCollectionModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "add-books",
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
