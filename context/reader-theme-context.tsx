"use client";

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
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ReaderThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ITheme>("light");

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
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("reader-theme") as ITheme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("reader-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, updateTheme }}>
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
