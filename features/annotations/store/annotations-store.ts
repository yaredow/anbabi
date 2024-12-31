import { create } from "zustand";
import { AnnoationColor, ANNOTATION_COLORS } from "../constants";
import { RenditionRef, Selection } from "@/features/books/types";
import { Annotation } from "epubjs/types/annotations";

type AnnotationStoreState = {
  selections: Selection[];
  addSelection: (selection: Selection) => void;
  removeSelection: (cfiRange: string) => void;
  clearSelections: () => void;

  selectedColor: AnnoationColor;
  setSelectedColor: (color: AnnoationColor) => void;

  // Annotation tracking
  annotations: Map<string, Annotation>;
  addAnnotation: (cfiRange: string, annotation: Annotation) => void;
  updateAnnotationColor: (
    cfiRange: string,
    color: AnnoationColor,
    renditionRef: RenditionRef,
    onClickCallback?: (cfiRange: string) => void,
  ) => void;
  removeAnnotation: (cfiRange: string, renditionRef: RenditionRef) => void;

  // Annotation related states
  isAnnotationOpen: boolean;
  setAnnotationOpen: (isOpen: boolean) => void;
};

export const useAnnotationStore = create<AnnotationStoreState>((set, get) => ({
  // Text selection state
  selections: [],
  addSelection: (selection) =>
    set((state) => ({ selections: [...state.selections, selection] })),
  removeSelection: (cfiRange) =>
    set((state) => ({
      selections: state.selections.filter(
        (selection) => selection.cfiRange !== cfiRange,
      ),
    })),
  clearSelections: () => set({ selections: [] }),

  selectedColor: ANNOTATION_COLORS.yellow,
  setSelectedColor: (color) => {
    set({ selectedColor: color });
  },

  // State related to annoatation
  annotations: new Map(),
  addAnnotation: (cfiRange, annotation) => {
    const { annotations } = get();
    annotations.set(cfiRange, annotation);
    set({ annotations });
  },

  updateAnnotationColor: (
    cfiRange,
    newColor,
    renditionRef,
    onClickCallback?: (cfiRange: string) => void,
  ) => {
    const state = get();
    const selection = state.selections.find((sel) => sel.cfiRange === cfiRange);

    if (selection && renditionRef.current) {
      // Remove the existing annotation
      renditionRef.current.annotations.remove("highlight", cfiRange);

      // Add a new annotation with the updated color
      renditionRef.current.annotations.add(
        "highlight",
        cfiRange,
        {},
        () => {
          if (onClickCallback) {
            onClickCallback(cfiRange);
          }
        },
        undefined,
        {
          fill: newColor.fill,
          "fill-opacity": newColor.opacity,
          "mix-blend-mode": "multiply",
        },
      );

      // Update the state with the new color
      set({
        selections: state.selections.map((sel) =>
          sel.cfiRange === cfiRange ? { ...sel, color: newColor } : sel,
        ),
      });
    }
  },
  removeAnnotation: (cfiRange: string, renditionRef) => {
    const state = get();
    const annotation = state.selections.find(
      (sel) => sel.cfiRange === cfiRange,
    );

    if (annotation && renditionRef.current) {
      renditionRef.current.annotations.remove(cfiRange, "highlight");
    }
  },

  // Annotation related states
  isAnnotationOpen: false,
  setAnnotationOpen: (isOpen) => set({ isAnnotationOpen: isOpen }),
}));
