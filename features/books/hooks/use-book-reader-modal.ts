"use client";

import { parseAsBoolean, useQueryState } from "nuqs";

export const useBookReaderModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "open-book",
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
