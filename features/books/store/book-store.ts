import { create } from "zustand";
import { ITheme, Selection } from "../types";
import { Rendition } from "epubjs";
import { fontFamilies } from "../constants";

type BookStoreState = {
  // Theme related state
  theme: ITheme;
  setTheme: (newTheme: ITheme) => void;
  updateTheme: (rendition: Rendition, theme: ITheme) => void;
  initializeTheme: () => void;

  // font size related state
  fontSize: number;
  setFontSize: (newFontSize: number) => void;
  updateFontSize: (rendition: Rendition, fontSize: number) => void;

  // font family realted state
  fontFamily: string;
  setFontFamily: (newFontFamily: string) => void;
  updateFontFamily: (rendition: Rendition, fontFamily: string) => void;

  // text selection related state
  selections: Selection[];
  addSelection: (selection: Selection) => void;
  removeSelection: (cfiRange: string) => void;
  clearSelections: () => void;

  // Assistant menu item related states
  activeView: string | null;
  setActiveView: (activeView: string) => void;
  clearActiveView: () => void;
};

export const useBookStore = create<BookStoreState>((set) => ({
  // Theme state
  theme: "light",
  setTheme: (newTheme) => {
    set({ theme: newTheme });
    localStorage.setItem("reader-theme", newTheme);
  },
  updateTheme: (rendition, theme) => {
    const themes = rendition.themes;
    switch (theme) {
      case "dark": {
        themes.override("color", "#fff");
        themes.override("background", "#000");
        break;
      }
      case "light": {
        themes.override("color", "#000");
        themes.override("background", "#fff");
        break;
      }
      case "sepia": {
        themes.override("color", "#5b4636");
        themes.override("background", "#f5deb3");
        break;
      }
      case "greenish":
        themes.override("color", "#3e4e3f");
        themes.override("background", "#e4f7e7");
        break;
    }
  },
  initializeTheme: () => {
    const savedTheme = localStorage.getItem("reader-theme") as ITheme;
    if (savedTheme) {
      set({ theme: savedTheme });
    }
  },

  // Font size state
  fontSize: 100,
  setFontSize: (newFontSize) => {
    set({ fontSize: newFontSize });
  },
  updateFontSize: (rendition, fontSize) => {
    if (rendition) {
      rendition.themes.fontSize(`${fontSize}%`);
    }
  },

  // Font family state
  fontFamily: fontFamilies[0].name,
  setFontFamily: (newFontFamily) => {
    set({ fontFamily: newFontFamily });
    localStorage.setItem("reader-font-family", newFontFamily);
  },
  updateFontFamily: (rendition, fontFamily) => {
    if (rendition) {
      rendition.themes.register("custom", {
        p: { "font-family": fontFamily },
      });
      rendition.themes.select("custom");
    }
  },

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

  // Assistant menu items modal state
  activeView: null,
  setActiveView: (view) => set({ activeView: view }),
  clearActiveView: () => set({ activeView: null }),
}));
