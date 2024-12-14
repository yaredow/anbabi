"use client";

import { useToolBarModal } from "@/hooks/use-tool-bar-modal";
import ResponsiveModal from "./responsive-modal";
import ResponsiveToolBarModal from "./responsive-tool-bar-modal";
import { ToolBar } from "./tool-bar";

type ToolBarModalProps = {
  fontSize: number;
  setFontSize: (fontSize: number) => void;
};

export default function ToolBarModal({
  setFontSize,
  fontSize,
}: ToolBarModalProps) {
  const { isOpen, setIsOpen, close } = useToolBarModal();

  return (
    <ResponsiveToolBarModal open={isOpen} onOpenChange={setIsOpen}>
      <ToolBar fontSize={fontSize} setFontSize={setFontSize} />
    </ResponsiveToolBarModal>
  );
}
