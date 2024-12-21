import React, { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Copy,
  Bookmark,
  Book,
  Languages,
  MessageCircleIcon,
} from "lucide-react";
import { useBookStore } from "@/features/books/store/book-store";
import { useAssistantMenuItemModal } from "../hooks/use-assitant-menu-item-modal";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

type AssistantMenuProps = {
  renditionRef?: any;
  selectedCfiRange: string;
  onClose: () => void;
};

type MenuItem = {
  icon: React.ReactNode;
  label: string;
  action: () => void;
};

export default function AssistantMenu({
  renditionRef,
  selectedCfiRange,
  onClose,
}: AssistantMenuProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const { removeSelection, selections } = useBookStore();
  const { open, setActiveView } = useAssistantMenuItemModal();
  const menuRef = useRef<HTMLDivElement | null>(null);

  const itemsPerPage = 5;

  const menuItems: MenuItem[] = [
    {
      icon: <X size={16} />,
      label: "Remove Highlight",
      action: handleRemoveSelection,
    },
    {
      icon: <Copy className="h-4 w-4" />,
      label: "Copy",
      action: handleCopy,
    },
    {
      icon: <Bookmark className="h-4 w-4" />,
      label: "Bookmark",
      action: () => handleOpenModal("bookmark"),
    },
    {
      icon: <Book className="h-4 w-4" />,
      label: "Dictionary",
      action: () => handleOpenModal("dictionary"),
    },
    {
      icon: <Languages className="h-4 w-4" />,
      label: "Translate",
      action: () => handleOpenModal("googleTranslate"),
    },
    {
      icon: <MessageCircleIcon className="h-4 w-4" />,
      label: "Ask AI",
      action: () => handleOpenModal("aiChat"),
    },
  ];

  const totalPages = Math.ceil(menuItems.length / itemsPerPage);

  async function handleCopy() {
    const matchingSelection = selections.find(
      (selection) => selection.cfiRange === selectedCfiRange,
    );
    if (matchingSelection) {
      try {
        await navigator.clipboard.writeText(matchingSelection.text);
        toast({ description: "Text copied to clipboard" });
        onClose();
      } catch (error) {
        console.error("Failed to copy text:", error);
      }
    }
  }

  function handleRemoveSelection() {
    const matchingSelection = selections.find(
      (selection) => selection.cfiRange === selectedCfiRange,
    );
    if (matchingSelection) {
      renditionRef?.current?.annotations.remove(selectedCfiRange, "highlight");
      removeSelection(selectedCfiRange);
      onClose();
    }
  }

  const handleOpenModal = (view: string) => {
    setActiveView(view);
    open(view);
  };

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="z-10 w-full bg-white rounded-lg shadow-lg p-2 flex items-center"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={prevPage}
        disabled={currentPage === 0}
        aria-label="Previous options"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <ul className="flex w-full flex-row gap-2 items-center">
        {menuItems
          .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
          .map((item, index) => (
            <li key={index}>
              <Button
                variant="ghost"
                size="icon"
                onClick={item.action}
                aria-label={item.label}
              >
                {item.icon}
              </Button>
            </li>
          ))}
      </ul>
      <Button
        variant="ghost"
        size="icon"
        onClick={nextPage}
        disabled={currentPage === totalPages - 1}
        aria-label="More options"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
