"use client";

import { useAssistantMenuModal } from "../hooks/use-assistant-menu-modal";
import ResponsiveAssistantMenuModal from "./responsive-assistant-menu-modal";
import { useBookStore } from "@/features/books/store/book-store";
import AssistantMenu from "./assistant-menu";
import { RenditionRef } from "@/features/books/types";

type AssistantMenuModalProps = {
  renditionRef: RenditionRef | undefined;
};

export default function AssistantMenuModal({
  renditionRef,
}: AssistantMenuModalProps) {
  const { isOpen, setIsOpen, close } = useAssistantMenuModal();

  return (
    <ResponsiveAssistantMenuModal open={isOpen} onOpenChange={setIsOpen}>
      <AssistantMenu renditionRef={renditionRef} />
    </ResponsiveAssistantMenuModal>
  );
}
