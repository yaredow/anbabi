"use client";

import React, { useState, useRef, useEffect } from "react";
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

interface FloatingMenuProps {
  position: { x: number; y: number };
  onItemClick: (
    type: "dictionary" | "wikipedia" | "translate" | "note" | "ai-chat",
  ) => void;
  onCopy: () => void;
}

export default function FloatingMenu({
  position,
  onItemClick,
  onCopy,
}: FloatingMenuProps) {
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
    <div className="absolute bg-white shadow-lg rounded-lg overflow-hidden z-10 flex items-center">
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
}
