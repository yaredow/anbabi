import React, { useMemo } from "react";
import { RenditionRef } from "@/features/books/types";
import { useAssistantMenuItemModal } from "../hooks/use-assitant-menu-item-modal";
import DictionaryCard from "./dictionary-card";
import { GoogleTranslateCard } from "./google-translate-card";
import { WikipediaCard } from "./wikipedia-card";
import { AIChatCard } from "./ai-chat-card";
import ResponsiveAssistantItemModal from "./responsive-assistant-menu-item-modal";
import { useBookStore } from "@/features/books/store/book-store";

type AssistantMenuModalProps = {
  renditionRef?: RenditionRef;
  selectedCfiRange: string;
};

export default function AssistantItemsModal({
  renditionRef,
  selectedCfiRange,
}: AssistantMenuModalProps) {
  const { close } = useAssistantMenuItemModal();
  const activeView = useBookStore.getState().activeView;
  const selectedText = useMemo(() => {
    const selections = useBookStore.getState().selections;
    const selection = selections.find(
      (selection) => selection.cfiRange === selectedCfiRange,
    );
    return selection?.text || "";
  }, [selectedCfiRange]);

  console.log(selectedText);

  const renderContent = () => {
    switch (activeView) {
      case "dictionary":
        return (
          <DictionaryCard
            word={selectedText}
            onClose={close}
            renditionRef={renditionRef}
          />
        );

      case "googleTranslate":
        return (
          <GoogleTranslateCard
            text={selectedCfiRange}
            onClose={close}
            renditionRef={renditionRef}
          />
        );

      case "aiChat":
        return <AIChatCard text={selectedCfiRange} onClose={close} />;
      case "wikipedia":
        return <WikipediaCard topic={selectedCfiRange} onClose={close} />;
      default:
        return null;
    }
  };

  return (
    <ResponsiveAssistantItemModal>
      {renderContent()}
    </ResponsiveAssistantItemModal>
  );
}
