import { RenditionRef } from "@/features/books/types";
import { useEffect, RefObject } from "react";

interface UseEpubModalCloserProps {
  modalRef: RefObject<HTMLElement | null>;
  renditionRef: RenditionRef;
  isOpen: boolean;
  onClose: () => void;
}

export function useEpubModalCloser({
  modalRef,
  renditionRef,
  isOpen,
  onClose,
}: UseEpubModalCloserProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleIframeClick = () => {
      onClose();
    };

    // Listen for clicks on the main document
    document.addEventListener("mousedown", handleClickOutside);

    // Listen for clicks inside the iframe using epub.js Rendition
    if (renditionRef.current) {
      renditionRef.current.on("click", handleIframeClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (renditionRef.current) {
        renditionRef.current.off("click", handleIframeClick);
      }
    };
  }, [modalRef, renditionRef, isOpen, onClose]);
}
