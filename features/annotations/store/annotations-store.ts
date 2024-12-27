import { create } from "zustand";
import { AnnoationColor, ANNOTATION_COLORS } from "../constants";

type AnnotationStoreState = {
  selectedColor: AnnoationColor;
  setSelectedColor: (color: AnnoationColor) => void;

  // Annotation related states
  isAnnotationOpen: boolean;
  setAnnotationOpen: (isOpen: boolean) => void;
};

export const useAnnotationStore = create<AnnotationStoreState>((set) => ({
  selectedColor: ANNOTATION_COLORS.yellow,
  setSelectedColor: (color) => set({ selectedColor: color }),

  // Annotation related states
  isAnnotationOpen: false,
  setAnnotationOpen: (isOpen) => set({ isAnnotationOpen: isOpen }),
}));
