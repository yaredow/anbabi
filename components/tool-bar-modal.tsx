"use client";

import { useToolBarModal } from "@/hooks/use-tool-bar-modal";
import ResponsiveModal from "./responsive-modal";
import ResponsiveToolBarModal from "./responsive-tool-bar-modal";
import { ToolBar } from "./tool-bar";
import { ITheme, RenditionRef } from "@/features/books/types";
import { Rendition } from "epubjs";

type ToolBarModalProps = {
  fontSize: number;
  setFontSize: (fontSize: number) => void;
  renditionRef: RenditionRef | undefined;
  updateTheme: (rendition: Rendition, theme: ITheme) => void;
};

export default function ToolBarModal({
  setFontSize,
  fontSize,
  renditionRef,
  updateTheme,
}: ToolBarModalProps) {
  const { isOpen, setIsOpen, close } = useToolBarModal();

  return (
    <ResponsiveToolBarModal open={isOpen} onOpenChange={setIsOpen}>
      <ToolBar
        fontSize={fontSize}
        setFontSize={setFontSize}
        renditionRef={renditionRef}
        updateTheme={updateTheme}
      />
    </ResponsiveToolBarModal>
  );
}
