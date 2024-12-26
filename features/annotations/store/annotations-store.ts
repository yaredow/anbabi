import { create } from "zustand";
import { AnnoationColor, ANNOTATION_COLORS } from "../constants";

type AnnotationStoreState = {
  selectedColor: AnnoationColor;
  setSelectedColor: (color: AnnoationColor) => void;
};

export const useAnnotationStore = create<AnnotationStoreState>((set) => ({
  selectedColor: ANNOTATION_COLORS.yellow,
  setSelectedColor: (color) => set({ selectedColor: color }),
}));
