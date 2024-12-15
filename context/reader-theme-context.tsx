"use client";

import { ITheme } from "@/features/books/types";
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
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ReaderThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ITheme>("light"); // default theme can be 'light'

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
    <ThemeContext.Provider value={{ theme, setTheme }}>
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
