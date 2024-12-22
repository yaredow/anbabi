import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import React, { useMemo } from "react";

import { useBookStore } from "@/features/books/store/book-store";
import { RenditionRef } from "@/features/books/types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useAssistantMenuItemModal } from "../hooks/use-assitant-menu-item-modal";
import { GoogleTranslateCard } from "./google-translate-card";
import { WikipediaCard } from "./wikipedia-card";
import DictionaryCard from "./dictionary-card";
import { AIChatCard } from "./ai-chat-card";

type AssistantMenuModalProps = {
  renditionRef?: RenditionRef;
  selectedCfiRange: string;
};

export default function AssistantItemsModal({
  renditionRef,
  selectedCfiRange,
}: AssistantMenuModalProps) {
  const { isOpen, setIsOpen } = useAssistantMenuItemModal();
  const { close } = useAssistantMenuItemModal();
  const activeView = useBookStore.getState().activeView;
  const selectedText = useMemo(() => {
    const selections = useBookStore.getState().selections;
    const selection = selections.find(
      (selection) => selection.cfiRange === selectedCfiRange,
    );
    return selection?.text || "";
  }, [selectedCfiRange]);

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
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DialogHeader>
        <VisuallyHidden>
          <DialogTitle>Title</DialogTitle>
        </VisuallyHidden>
      </DialogHeader>

      <DialogContent
        className="w-[16rem] md:h-72 sm:max-w-lg p-0 border-none overflow-hidden hide-scrollbar 
             fixed top-1/2 right-1/2 transform -translate-y-1/2 -translate-x-1/2 
             sm:w-[20rem] sm:h-full "
      >
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
