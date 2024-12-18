"use client";

import { fontFamilies } from "@/features/books/constants";
import { ITheme } from "@/features/books/types";
import { Rendition } from "epubjs";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type ThemeContextType = {
  theme: ITheme;
  setTheme: (theme: ITheme) => void;
  updateTheme: (rendition: Rendition, theme: ITheme) => void;
  fontFamily: string;
  changeFontFamily: (font: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ReaderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ITheme>("light");
  const [fontFamily, setFontFamily] = useState(fontFamilies[0].name);

  const changeFontFamily = (fontFamily: string) => {
    setFontFamily(fontFamily);
  };

  const updateTheme = (rendition: Rendition, theme: ITheme) => {
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
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("reader-theme") as ITheme;
    const savedFontFamily = localStorage.getItem(
      "reader-font-family",
    ) as string;
    if (savedTheme || savedFontFamily) {
      setTheme(savedTheme);
      setFontFamily(savedFontFamily);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("reader-theme", theme);
    localStorage.setItem("reader-font-family", fontFamily);
  }, [theme, fontFamily]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        updateTheme,
        fontFamily,
        changeFontFamily,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
