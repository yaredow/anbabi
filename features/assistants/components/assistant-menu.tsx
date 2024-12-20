"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Bookmark,
  Globe,
  MessageSquareIcon as MessageSquareQuestion,
  Book,
  ChevronLeft,
  ChevronRight,
  X,
  Languages,
} from "lucide-react";
import { useBookStore } from "@/features/books/store/book-store";
import { RenditionRef } from "@/features/books/types";
import { toast } from "@/hooks/use-toast";

interface MenuPosition {
  top: number;
  left: number;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  action: () => void;
}

type AssistantMenuProps = {
  renditionRef: RenditionRef | undefined;
  selectedCfiRange: string;
  onClose: () => void;
};

export default function AssistantMenu({
  renditionRef,
  selectedCfiRange,
  onClose,
}: AssistantMenuProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const { removeSelection, selections } = useBookStore();
  const menuRef = useRef<HTMLDivElement | null>(null);

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
      action: handleBookmark,
    },

    {
      icon: <Book className="h-4 w-4" />,
      label: "Dictionary",
      action: handleDictionary,
    },

    {
      icon: <Languages className="h-4 w-4" />,
      label: "Translate",
      action: handleTranslate,
    },
    {
      icon: <MessageSquareQuestion className="h-4 w-4" />,
      label: "Ask AI",
      action: handleAskAI,
    },
  ];

  const itemsPerPage = 5;
  const totalPages = Math.ceil(menuItems.length / itemsPerPage);

  async function handleCopy() {
    const selections = useBookStore.getState().selections;
    const matchingSelection = selections.find(
      (selection) => selection.cfiRange === selectedCfiRange,
    );

    if (matchingSelection) {
      try {
        await navigator.clipboard.writeText(matchingSelection.text);
        toast({
          description: "Text copied to clipboard",
        });
        onClose();
      } catch (error) {
        console.error(error);
      }
    }
  }

  function handleBookmark() {
    alert(`Bookmarked: "${selections[0].text}"`);
  }

  function handleTranslate() {
    alert(`Translate: "${selections[0].text}"`);
  }

  function handleAskAI() {
    alert(`Ask AI: "${selections[0].text}"`);
  }

  function handleDictionary() {
    alert(`Dictionary: "${selections[0].text}"`);
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

  function nextPage() {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  }

  function prevPage() {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  }

  useEffect(() => {
    // Handler to close the menu when clicked outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Attach the event listener to detect clicks outside the menu
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="z-10 w-full bg-white rounded-lg shadow-lg p-2 flex items-center "
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
            <li className="" key={index}>
              <Button
                key={index}
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
