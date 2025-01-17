"use client";

import { useAnnotationModal } from "../hooks/use-annotation-modal";
import { AnnotationsView } from "./annotations-view";
import { SAMPLE_ANNOTATIONS } from "../constants";
import ResponsiveMenuModal from "@/components/responsive-menu-modal";

export default function AnnotaionModal() {
  const { isOpen, setIsOpen, close } = useAnnotationModal();

  return (
    <ResponsiveMenuModal open={isOpen} onOpenChange={setIsOpen}>
      <AnnotationsView
        annotations={SAMPLE_ANNOTATIONS}
        count={SAMPLE_ANNOTATIONS.length}
        chapter="chapter 1"
      />
    </ResponsiveMenuModal>
  );
}
