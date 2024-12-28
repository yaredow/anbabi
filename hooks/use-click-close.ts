import { RenditionRef } from "@/features/books/types";
import { useEffect, useRef, useState } from "react";

// Custom hook to handle clicks outside of the menu, including iframe clicks
export function useClickOutsideWithIframe({
  ref,
  renditionRef,
  callback,
}: {
  ref: React.RefObject<HTMLElement | null>;
  renditionRef: RenditionRef;
  callback: () => void;
}) {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const initialMouseDownTarget = useRef<Node | null>(null);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      setIsMouseDown(true);
      initialMouseDownTarget.current = event.target;
    };

    const handleMouseUp = (event: MouseEvent) => {
      const target = event.target as Node;

      // Check if the click happened outside the main ref (the dropdown or menu)
      const isOutsideMainRef = ref.current && !ref.current.contains(target);

      let isInsideIframe = false;

      // Check if renditionRef.current is defined and if it contains content
      if (renditionRef.current) {
        const contents = renditionRef.current.getContents(); // Get all content (if multiple)

        // Handle multiple content elements (iframes)
        if (Array.isArray(contents)) {
          contents.forEach((content) => {
            const iframeDoc = content.document; // Get the document of each iframe
            if (iframeDoc && iframeDoc.contains(target)) {
              isInsideIframe = true;
            }
          });
        } else {
          // Single content element case
          const iframeDoc = contents.document; // Get the document for the single content
          if (iframeDoc && iframeDoc.contains(target)) {
            isInsideIframe = true;
          }
        }
      }

      // Close the menu only if the click started outside the menu and ended outside the menu and iframe
      if (
        isOutsideMainRef &&
        !isInsideIframe &&
        initialMouseDownTarget.current !== target
      ) {
        callback(); // Trigger callback to close the menu
      }

      setIsMouseDown(false);
      initialMouseDownTarget.current = null;
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [ref, renditionRef, callback]);
}
