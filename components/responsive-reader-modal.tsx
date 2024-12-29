import React, { ReactElement, useState } from "react";
import { X, Maximize2, Minimize2, Settings, NotebookIcon } from "lucide-react";
import { useMedia } from "react-use";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useToolBarModal } from "@/hooks/use-tool-bar-modal";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBookStore } from "@/features/books/store/book-store";
import { AnnotationsView } from "@/features/annotations/components/annotations-view";
import { SAMPLE_ANNOTATIONS } from "@/features/annotations/constants";
import { useAnnotationStore } from "@/features/annotations/store/annotations-store";
import ReaderMenu from "@/features/books/components/reader-menu";
import { RenditionRef } from "@/features/books/types";

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
  const { setAnnotationOpen } = useAnnotationStore();

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
                onClick={() => setAnnotationOpen((prev) => !prev)}
                className={`${theme === "dark" && "text-white"}`}
              >
                <NotebookIcon className="h-5 w-5" />
              </Button>
              <AnnotationsView
                onClose={() => setAnnotationOpen(false)}
                annotations={SAMPLE_ANNOTATIONS}
                chapter="Chapter 1"
                count={SAMPLE_ANNOTATIONS.length}
              />
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
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        id="reader-modal"
        className="h-screen p-0 overflow-hidden border-none fixed"
      >
        <div className="absolute top-2 right-2 z-10">
          <Button
            onClick={() => onOpenChange(false)}
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="h-full overflow-y-auto pt-10">{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
