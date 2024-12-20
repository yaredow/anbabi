"use client";

import { useState, useEffect, useCallback } from "react";
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
} from "lucide-react";

interface MenuPosition {
  top: number;
  left: number;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  action: () => void;
}

export default function KindleMenu() {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<MenuPosition>({ top: 0, left: 0 });
  const [selectedText, setSelectedText] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

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
      icon: <Globe className="h-4 w-4" />,
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

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
      setSelectedText(selection.toString());
      setIsVisible(true);
      setCurrentPage(0);
    } else {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", handleTextSelection);
    return () => {
      document.removeEventListener("selectionchange", handleTextSelection);
    };
  }, [handleTextSelection]);

  function handleCopy() {
    navigator.clipboard.writeText(selectedText);
    setIsVisible(false);
  }

  function handleBookmark() {
    alert(`Bookmarked: "${selectedText}"`);
    setIsVisible(false);
  }

  function handleTranslate() {
    alert(`Translate: "${selectedText}"`);
    setIsVisible(false);
  }

  function handleAskAI() {
    alert(`Ask AI: "${selectedText}"`);
    setIsVisible(false);
  }

  function handleDictionary() {
    alert(`Dictionary: "${selectedText}"`);
    setIsVisible(false);
  }

  function handleRemoveSelection() {}

  function nextPage() {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  }

  function prevPage() {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  }

  return (
    <div className="z-10 w-full bg-white rounded-lg shadow-lg p-2 flex items-center ">
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
            <li className="">
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
