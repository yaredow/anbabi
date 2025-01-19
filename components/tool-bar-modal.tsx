"use client";

import { useToolBarModal } from "@/hooks/use-tool-bar-modal";
import ResponsiveToolBarModal from "./responsive-tool-bar-modal";
import { RenditionRef } from "@/features/books/types";
import ToolBar from "./tool-bar";

type ToolBarModalProps = {
  renditionRef: RenditionRef | undefined;
};

export default function ToolBarModal({ renditionRef }: ToolBarModalProps) {
  const { isOpen, setIsOpen } = useToolBarModal();

  return (
    <ResponsiveToolBarModal open={isOpen} onOpenChange={setIsOpen}>
      <ToolBar renditionRef={renditionRef} />
    </ResponsiveToolBarModal>
  );
}
