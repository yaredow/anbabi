import React, { useState, useRef } from "react";
import { FaWikipediaW } from "react-icons/fa6";
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

import { toast } from "@/hooks/use-toast";

import { useAnnotationStore } from "@/features/annotations/store/annotations-store";
import {
  AnnoationColor,
  ANNOTATION_COLORS,
} from "@/features/annotations/constants";
import { useBookStore } from "@/features/books/store/book-store";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useAssistantMenuItemModal } from "../hooks/use-assitant-menu-item-modal";
import { useCloseModalOnClick } from "@/hooks/use-close-modal-on-click";
import { useAssistantMenuModal } from "../hooks/use-assistant-menu-modal";

type AssistantMenuProps = {
  selectedCfiRange: string;
  onClose: () => void;
};

type MenuItem = {
  icon?: React.ReactNode;
  label?: string;
  type?: string;
  action?: () => void;
};

export default function AssistantMenu({
  selectedCfiRange,
  onClose,
}: AssistantMenuProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const { renditionRef } = useBookStore();
  const {
    selections,
    removeSelection,
    updateAnnotationColor,
    removeAnnotation,
  } = useAnnotationStore();
  const { selectedColor, setSelectedColor } = useAnnotationStore();
  const { close, isOpen } = useAssistantMenuModal();
  const { open } = useAssistantMenuItemModal();

  const menuRef = useRef<HTMLDivElement | null>(null);
  const itemsPerPage = 5;

  const colorPickerItems = Object.entries(ANNOTATION_COLORS).map(
    ([colorName, colorData]) => {
      const isSelected = selectedColor?.fill === colorData.fill;

      return {
        icon: (
          <div
            className="w-6 h-6 relative flex items-center justify-center rounded-full"
            style={{
              backgroundColor: colorData.fill,
              opacity: colorData.opacity,
            }}
            onClick={() => handleColorChange(colorData)}
          >
            {isSelected && (
              <div
                onClick={(event: React.MouseEvent) => {
                  event.stopPropagation();
                  handleRemoveSelection();
                }}
                className="absolute top-0 right-0 bg-transparent text-white rounded-full p-1 cursor-pointer"
              >
                <X size={12} className="text-black" />
              </div>
            )}
          </div>
        ),
        type: "color",
      };
    },
  );

  const menuItems: MenuItem[] = [
    ...colorPickerItems,
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
      icon: <FaWikipediaW className="h-4 w-4" />,
      label: "Wikipedia",
      action: () => handleOpenModal("wikipedia"),
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

  function handleColorChange(newColor: AnnoationColor) {
    setSelectedColor(newColor);

    if (selectedCfiRange) {
      removeAnnotation(selectedCfiRange, renditionRef);

      updateAnnotationColor(selectedCfiRange, newColor, renditionRef);
    }
    onClose();
  }

  const handleOpenModal = (view: string) => {
    useBookStore.getState().setActiveView(view);
    open();
  };

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

  useCloseModalOnClick({
    modalRef: menuRef,
    renditionRef,
    isOpen,
    onClose: close,
  });

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
              {item.type === "color" ? (
                // Render without tooltip for color items
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={item.label}
                  className="rounded-full"
                >
                  {item.icon}
                </Button>
              ) : (
                // Render with tooltip for other items
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={item.label}
                        onClick={item.action}
                      >
                        {item.icon}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
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
