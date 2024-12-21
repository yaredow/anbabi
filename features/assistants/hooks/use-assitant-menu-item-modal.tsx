import { parseAsBoolean, useQueryState } from "nuqs";
import { useState } from "react";

export const useAssistantMenuItemModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "open-menu",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }),
  );

  const [activeView, setActiveView] = useState<string | null>(null);

  const open = (view: string) => {
    setActiveView(view);
    setIsOpen(true);
  };

  const close = () => {
    setActiveView(null);
    setIsOpen(false);
  };

  return {
    open,
    close,
    isOpen,
    activeView,
    setIsOpen,
    setActiveView,
  };
};
