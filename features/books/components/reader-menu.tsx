import { useEffect, useRef, useState } from "react";
import {
  EllipsisVerticalIcon,
  Maximize2,
  NotebookIcon,
  Settings,
  X,
} from "lucide-react";

import { useToolBarModal } from "@/hooks/use-tool-bar-modal";

import { useAnnotationModal } from "@/features/annotations/hooks/use-annotation-modal";
import { useBookReaderModal } from "@/features/books/hooks/use-book-reader-modal";

import { Button } from "@/components/ui/button";
import { useBookStore } from "../store/book-store";
import { useCloseModalOnClick } from "@/hooks/use-close-modal-on-click";

type ReaderMenuProps = {
  handleMaximizeToggle: () => void;
};

export default function ReaderMenu({ handleMaximizeToggle }: ReaderMenuProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { renditionRef } = useBookStore();

  const { close } = useBookReaderModal();
  const { open: openToolBar } = useToolBarModal();
  const { open: openAnnotationModal } = useAnnotationModal();

  const handleMenuToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleCloseMenu = () => {
    setIsOpen(false);
  };

  const handleOpenSettings = (event: React.MouseEvent) => {
    event.preventDefault();
    openToolBar();
    handleCloseMenu();
  };

  const handleOpenAnnotations = (event: React.MouseEvent) => {
    event.preventDefault();
    openAnnotationModal();
    handleCloseMenu();
  };

  useCloseModalOnClick({
    modalRef: menuRef,
    renditionRef: renditionRef,
    isOpen,
    onClose: () => setIsOpen(false),
  });

  return (
    <div className="relative">
      <Button variant="ghost" onClick={handleMenuToggle}>
        <EllipsisVerticalIcon className="size-4" />
      </Button>
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background ring-1 ring-black ring-opacity-5"
        >
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <button
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={handleMaximizeToggle}
            >
              <Maximize2 className="mr-3 size-4" />
              <span>Maximize</span>
            </button>

            <button
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={handleOpenAnnotations}
            >
              <NotebookIcon className="mr-3 size-4" />
              <span>Annotations</span>
            </button>

            <button
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={handleOpenSettings}
            >
              <Settings className="mr-3 size-4" />
              <span>Settings</span>
            </button>
            <button
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => close()}
            >
              <X className="mr-3 size-4" />
              <span>Close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
