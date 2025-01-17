"use client";

import { useAnnotationModal } from "../hooks/use-annotation-modal";
import { AnnotationsView } from "./annotations-view";
import { SAMPLE_ANNOTATIONS } from "../constants";
import ResponsiveAnnotationModal from "./responsive-annotation-modal";

export default function AnnotaionModal() {
  const { isOpen, setIsOpen, close } = useAnnotationModal();

  return (
    <ResponsiveAnnotationModal open={isOpen} onOpenChange={setIsOpen}>
      <AnnotationsView
        annotations={SAMPLE_ANNOTATIONS}
        count={SAMPLE_ANNOTATIONS.length}
        chapter="chapter 1"
      />
    </ResponsiveAnnotationModal>
  );
}
