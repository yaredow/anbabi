"use client";

import { parseAsBoolean, useQueryState } from "nuqs";

export const useCreateCollectionModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-collection",
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
