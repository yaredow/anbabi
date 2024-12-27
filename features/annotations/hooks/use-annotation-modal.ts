"use client";

import { parseAsBoolean, useQueryState } from "nuqs";

export const useAnnotationModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "open-annotation",
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
