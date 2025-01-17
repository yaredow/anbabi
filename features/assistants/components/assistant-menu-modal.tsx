"use client";

import ResponsiveMenuModal from "@/components/responsive-menu-modal";

import { useAssistantMenuModal } from "../hooks/use-assistant-menu-modal";
import AssistantMenu from "./assistant-menu";

type AssistantMenuModalProps = {
  selectedCfiRange: string;
  handleHighlightClick: (cfiRange: string) => void;
};

export default function AssistantMenuModal({
  selectedCfiRange,
  handleHighlightClick,
}: AssistantMenuModalProps) {
  const { isOpen, setIsOpen, close } = useAssistantMenuModal();

  return (
    <ResponsiveMenuModal open={isOpen} onOpenChange={setIsOpen}>
      <AssistantMenu
        selectedCfiRange={selectedCfiRange}
        onClose={close}
        handleHighlightClick={handleHighlightClick}
      />
    </ResponsiveMenuModal>
  );
}
