import { create } from "zustand";
import { ITheme } from "../types";
import { Rendition } from "epubjs";

type BookStoreState = {
  theme: ITheme;
  setTheme: (newTheme: ITheme) => void;
  updateTheme: (rendition: Rendition, theme: ITheme) => void;
  initializeTheme: () => void;
};

export const useBookStore = create<BookStoreState>((set) => ({
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
}));
