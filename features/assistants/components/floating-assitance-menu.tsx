"use client";

import React, { useState, useRef, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Globe,
  Languages,
  Pencil,
  Copy,
  MessageSquare,
} from "lucide-react";
import { useMedia } from "react-use";
import { DictionaryCard } from "./dictionary-card";
import { WikipediaCard } from "./wikipedia-card";
import { AIChatCard } from "./ai-chat-card";
import { NoteCard } from "./note-card";
import { TranslateCard } from "./google-translate-card";

const EnhancedReader: React.FC = () => {
  const [selectedText, setSelectedText] = useState("");
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const [activeCard, setActiveCard] = useState<
    "dictionary" | "wikipedia" | "translate" | "note" | "ai-chat" | null
  >(null);

  const isDesktop = useMedia("(min-width: 1024px)", true);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      setSelectedText(selection.toString().trim());
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setMenuPosition({ x: rect.left, y: rect.bottom });
      setShowMenu(true);
    } else {
      setShowMenu(false);
    }
  };

  const handleCardClick = (
    type: "dictionary" | "wikipedia" | "translate" | "note" | "ai-chat",
  ) => {
    setActiveCard(type);
    setShowMenu(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedText);
    setShowMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        paragraphRef.current &&
        !paragraphRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <p
        ref={paragraphRef}
        onMouseUp={handleTextSelection}
        onTouchEnd={handleTextSelection}
        className="text-lg mb-4"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>

      {showMenu && (
        <FloatingMenu
          position={menuPosition}
          onItemClick={handleCardClick}
          onCopy={handleCopy}
        />
      )}

      {activeCard && (
        <div
          className={
            !isDesktop
              ? "fixed bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto"
              : "fixed bottom-4 right-4 w-96"
          }
        >
          {activeCard === "dictionary" && (
            <DictionaryCard
              word={selectedText}
              onClose={() => setActiveCard(null)}
            />
          )}
          {activeCard === "wikipedia" && (
            <WikipediaCard
              word={selectedText}
              onClose={() => setActiveCard(null)}
            />
          )}
          {activeCard === "translate" && (
            <TranslateCard
              word={selectedText}
              onClose={() => setActiveCard(null)}
            />
          )}
          {activeCard === "note" && (
            <NoteCard word={selectedText} onClose={() => setActiveCard(null)} />
          )}
          {activeCard === "ai-chat" && (
            <AIChatCard
              word={selectedText}
              onClose={() => setActiveCard(null)}
            />
          )}
        </div>
      )}
    </div>
  );
};

interface FloatingMenuProps {
  position: { x: number; y: number };
  onItemClick: (
    type: "dictionary" | "wikipedia" | "translate" | "note" | "ai-chat",
  ) => void;
  onCopy: () => void;
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({
  position,
  onItemClick,
  onCopy,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const menuItems = [
    {
      icon: <Pencil size={16} />,
      label: "Note",
      action: () => onItemClick("note"),
    },
    { icon: <Copy size={16} />, label: "Copy", action: onCopy },
    {
      icon: <MessageSquare size={16} />,
      label: "Chat with AI",
      action: () => onItemClick("ai-chat"),
    },
    {
      icon: <BookOpen size={16} />,
      label: "Dictionary",
      action: () => onItemClick("dictionary"),
    },
    {
      icon: <Globe size={16} />,
      label: "Wikipedia",
      action: () => onItemClick("wikipedia"),
    },
    {
      icon: <Languages size={16} />,
      label: "Translate",
      action: () => onItemClick("translate"),
    },
  ];

  const visibleItems = menuItems.slice(currentIndex, currentIndex + 3);

  return (
    <div
      className="absolute bg-white shadow-lg rounded-lg overflow-hidden z-10 flex items-center"
      style={{ left: `${position.x}px`, top: `${position.y + 10}px` }}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
        disabled={currentIndex === 0}
      >
        <ChevronLeft size={16} />
      </Button>
      {visibleItems.map((item, index) => (
        <Button
          key={index}
          variant="ghost"
          onClick={item.action}
          className="flex items-center gap-2"
        >
          {item.icon}
          <span>{item.label}</span>
        </Button>
      ))}
      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          setCurrentIndex(Math.min(menuItems.length - 3, currentIndex + 1))
        }
        disabled={currentIndex >= menuItems.length - 3}
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};

export default EnhancedReader;
