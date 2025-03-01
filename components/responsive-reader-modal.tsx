import React, { ReactElement, useState } from "react";
import { Maximize2, Minimize2, Settings, NotebookIcon } from "lucide-react";
import { useMedia } from "react-use";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useToolBarModal } from "@/hooks/use-tool-bar-modal";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBookStore } from "@/features/books/store/book-store";
import ReaderMenu from "@/features/books/components/reader-menu";
import { Sheet, SheetContent, SheetOverlay } from "./ui/sheet";

interface ResponsiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export default function ResponsiveReaderModal({
  open,
  onOpenChange,
  children,
}: ResponsiveModalProps): ReactElement {
  const isDesktop = useMedia("(min-width: 1024px)", true);
  const { open: openToolBar } = useToolBarModal();
  const [isMaximized, setIsMaximized] = useState(false);
  const { theme } = useBookStore();

  const handleMaximizeToggle = () => setIsMaximized((prev) => !prev);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>Reader</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        <DialogContent
          className={`fixed p-0 border-none overflow-hidden bg-background ${
            isMaximized
              ? "w-screen h-screen max-w-none max-h-none inset-0 z-50"
              : "w-[450px] h-[667px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          }`}
          style={{
            position: isMaximized ? "fixed" : "absolute",
            top: isMaximized ? 0 : "50%",
            left: isMaximized ? 0 : "50%",
            transform: isMaximized ? "none" : "translate(-50%, -50%)",
          }}
        >
          {isMaximized ? (
            <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
              <Button
                variant="ghost"
                className={`${theme === "dark" && "text-white"}`}
              >
                <NotebookIcon className="h-5 w-5" />
              </Button>
              <Button
                variant="link"
                onClick={openToolBar}
                className={`${theme === "dark" && "text-white"}`}
              >
                <Settings className="size-4" />
              </Button>
              <Button
                onClick={handleMaximizeToggle}
                variant="link"
                size="icon"
                className={`${theme === "dark" && "text-white"}`}
              >
                {isMaximized ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                onClick={() => onOpenChange(false)}
                variant="link"
                size="icon"
                className={`${theme === "dark" && "text-white"}`}
              >
                <span className="sr-only">Close</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </div>
          ) : (
            <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
              <ReaderMenu handleMaximizeToggle={handleMaximizeToggle} />
            </div>
          )}
          <div
            className={`${isMaximized ? "h-screen" : "h-full"} overflow-hidden flex flex-col`}
          >
            {children}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetOverlay />
      <SheetContent className="w-full h-screen p-0 border-none overflow-y-auto hide-scrollbar">
        <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
          <ReaderMenu handleMaximizeToggle={handleMaximizeToggle} />
        </div>
        {children}
      </SheetContent>
    </Sheet>
  );
}
