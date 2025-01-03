import React, { useMemo, useRef } from "react";

import { useBookStore } from "@/features/books/store/book-store";
import { RenditionRef } from "@/features/books/types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useAssistantMenuItemModal } from "../hooks/use-assitant-menu-item-modal";
import DictionaryCard from "./dictionary-card";
import WikipediaCard from "./wikipedia-card";
import TranslateCard from "./translate-card";
import { AIChatCard } from "./ai-chat-card";
import { useCloseModalOnClick } from "@/hooks/use-close-modal-on-click";
import { useAnnotationStore } from "@/features/annotations/store/annotations-store";

type AssistantMenuModalProps = {
  selectedCfiRange: string;
};

export default function AssistantItemsModal({
  selectedCfiRange,
}: AssistantMenuModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const { isOpen, setIsOpen, close } = useAssistantMenuItemModal();
  const activeView = useBookStore.getState().activeView;
  const { renditionRef } = useBookStore();

  const selectedText = useMemo(() => {
    const selections = useAnnotationStore.getState().selections;
    const selection = selections.find(
      (selection) => selection.cfiRange === selectedCfiRange,
    );
    return selection?.text || "";
  }, [selectedCfiRange]);

  const renderDynamicTitle = () => {
    switch (activeView) {
      case "dictionary":
        return "Dictionary";
      case "googleTranslate":
        return "Translate";
      case "aiChat":
        return "AI Chat";
      case "wikipedia":
        return "Wikipedia";
      default:
        return "Assistant";
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case "dictionary":
        return <DictionaryCard word={selectedText} onClose={close} />;

      case "googleTranslate":
        return <TranslateCard selectedText={selectedText} onClose={close} />;

      case "aiChat":
        return <AIChatCard text={selectedText} />;
      case "wikipedia":
        return <WikipediaCard selectedText={selectedText} />;
      default:
        return null;
    }
  };

  useCloseModalOnClick({
    modalRef: dialogRef,
    renditionRef,
    isOpen,
    onClose: close,
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DialogContent
        className={`p-0 border-none overflow-hidden hide-scrollbar 
            fixed top-1/2 transform -translate-y-1/2
            flex flex-col shadow-lg rounded-lg bg-background
            ${
              activeView === "aiChat"
                ? "h-[25rem] w-[350px]"
                : "h-[22rem] w-[300px]"
            } 
            max-h-[80vh] max-w-[90vw]
            sm:right-4 md:right-8 lg:right-16`}
      >
        <DialogHeader className="p-2 h-10 bg-muted w-full flex-shrink-0">
          <DialogTitle className="text-sm font-medium">
            {renderDynamicTitle()}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-auto p-4">{renderContent()}</div>
      </DialogContent>
    </Dialog>
  );
}
