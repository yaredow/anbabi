"use client";

import { useAssistantMenuModal } from "../hooks/use-assistant-menu-modal";
import ResponsiveAssistantMenuModal from "./responsive-assistant-menu-modal";
import { useBookStore } from "@/features/books/store/book-store";
import AssistantMenu from "./assistant-menu";

export default function AssistantMenuModal() {
  const { isOpen, setIsOpen, close } = useAssistantMenuModal();
  const { selections } = useBookStore();

  return (
    <ResponsiveAssistantMenuModal open={isOpen} onOpenChange={setIsOpen}>
      <AssistantMenu />
    </ResponsiveAssistantMenuModal>
  );
}
