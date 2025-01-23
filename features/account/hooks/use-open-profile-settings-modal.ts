"use client";

import { parseAsBoolean, useQueryState } from "nuqs";

export const useOpeUserProfileSettingsModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "open-profile-settings",
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
