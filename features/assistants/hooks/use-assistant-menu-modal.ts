"use client";

import { parseAsBoolean, useQueryState } from "nuqs";

export const useAssistantMenuModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "open-menu",
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
