"use client";

import { useToolBarModal } from "@/hooks/use-tool-bar-modal";
import ResponsiveToolBarModal from "./responsive-tool-bar-modal";
import { ToolBar } from "./tool-bar";
import { RenditionRef } from "@/features/books/types";

type ToolBarModalProps = {
  fontSize: number;
  setFontSize: (fontSize: number) => void;
  renditionRef: RenditionRef | undefined;
};

export default function ToolBarModal({
  setFontSize,
  fontSize,
  renditionRef,
}: ToolBarModalProps) {
  const { isOpen, setIsOpen, close } = useToolBarModal();

  return (
    <ResponsiveToolBarModal open={isOpen} onOpenChange={setIsOpen}>
      <ToolBar
        fontSize={fontSize}
        setFontSize={setFontSize}
        renditionRef={renditionRef}
      />
    </ResponsiveToolBarModal>
  );
}
