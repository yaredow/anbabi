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
  setTheme: (theme: ITheme) => void;
  theme: ITheme;
  renditionRef: RenditionRef | null;
  updateTheme: (rendition: Rendition, theme: ITheme) => void;
};

export default function ToolBarModal({
  setFontSize,
  fontSize,
  setTheme,
  theme,
  updateTheme,
  renditionRef,
}: ToolBarModalProps) {
  const { isOpen, setIsOpen, close } = useToolBarModal();

  return (
    <ResponsiveToolBarModal open={isOpen} onOpenChange={setIsOpen}>
      <ToolBar
        fontSize={fontSize}
        setFontSize={setFontSize}
        renditionRef={renditionRef}
        setTheme={setTheme}
        theme={theme}
        updateTheme={updateTheme}
      />
    </ResponsiveToolBarModal>
  );
}
