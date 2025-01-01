"use client";

import { useAnnotationModal } from "../hooks/use-annotation-modal";
import { AnnotationsView } from "./annotations-view";
import { SAMPLE_ANNOTATIONS } from "../constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function AnnotaionModal() {
  const { isOpen, setIsOpen, close } = useAnnotationModal();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DialogContent className="sm:max-w-[450px] md:max-w-[400px]">
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>Title</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        <AnnotationsView
          annotations={SAMPLE_ANNOTATIONS}
          count={SAMPLE_ANNOTATIONS.length}
          chapter="chapter 1"
          onClose={close}
        />
      </DialogContent>
    </Dialog>
  );
}
