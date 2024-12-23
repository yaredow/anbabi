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
import DictionaryCard from "./dictionary-card";
import { AIChatCard } from "./ai-chat-card";
import WikipediaCard from "./wikipedia-card";
import TranslateCard from "./translate-card";

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

  const renderHeader = () => {
    switch (activeView) {
      case "dictionary":
        return (
          <div className="bg-neutral-200 p-2 h-10 border-b border-gray-300">
            <span className="font-serif text-lg text-[#202122]">
              Dictionary
            </span>
          </div>
        );
      case "googleTranslate":
        return (
          <div className="bg-neutral-200 p-2 h-10 border-b border-gray-300">
            <span className="font-serif text-lg text-[#202122]">
              Google Translate
            </span>
          </div>
        );
      case "aiChat":
        return (
          <div className="bg-neutral-200 p-2 h-10 border-b border-gray-300">
            <span className="font-serif text-lg text-[#202122]">AI Chat</span>
          </div>
        );
      case "wikipedia":
        return (
          <div className="bg-neutral-200 h-10 p-2 border-b border-gray-300">
            <span className="font-serif text-lg text-[#202122]">Wikipedia</span>
          </div>
        );
      default:
        return null;
    }
  };

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
        return <TranslateCard selectedText={selectedText} onClose={close} />;

      case "aiChat":
        return <AIChatCard text={selectedCfiRange} onClose={close} />;
      case "wikipedia":
        return <WikipediaCard selectedText={selectedText} onClose={close} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DialogHeader>
        <VisuallyHidden>
          <DialogTitle>title</DialogTitle>
        </VisuallyHidden>
      </DialogHeader>

      <DialogContent
        className="w-[16rem] bg-neutral-50 md:h-72 sm:max-w-lg p-0 border-none overflow-hidden hide-scrollbar 
             fixed top-1/2 right-1/2 transform -translate-y-1/2 -translate-x-1/2 
             sm:w-[20rem] sm:h-full"
      >
        {renderHeader()}
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
