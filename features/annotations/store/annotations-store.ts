import { create } from "zustand";
import { AnnoationColor, ANNOTATION_COLORS } from "../constants";
import { Selection } from "@/features/books/types";

type AnnotationStoreState = {
  selections: Selection[];
  addSelection: (selection: Selection) => void;
  removeSelection: (cfiRange: string) => void;
  clearSelections: () => void;

  selectedColor: AnnoationColor;
  setSelectedColor: (color: AnnoationColor) => void;

  // Annotation related states
  isAnnotationOpen: boolean;
  setAnnotationOpen: (isOpen: boolean) => void;
};

export const useAnnotationStore = create<AnnotationStoreState>((set) => ({
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

  // Annotation related states
  isAnnotationOpen: false,
  setAnnotationOpen: (isOpen) => set({ isAnnotationOpen: isOpen }),
}));
