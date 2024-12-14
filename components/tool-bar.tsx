import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ITheme, RenditionRef } from "@/features/books/types";
import { Rendition } from "epubjs";
import { Moon, Sun } from "lucide-react";

type ToolbarContentProps = {
  fontSize: number;
  setFontSize: (size: number) => void;
  setTheme: (theme: ITheme) => void;
  theme: ITheme;
  onClose?: () => void;
  renditionRef: RenditionRef | null;
  updateTheme: (rendition: Rendition, theme: ITheme) => void;
};

export const ToolBar: React.FC<ToolbarContentProps> = ({
  fontSize,
  setFontSize,
  theme,
  setTheme,
  renditionRef,
  updateTheme,
  onClose,
}) => {
  const isDarkMode = theme === "dark";

  const toggleDarkMode = () => {
    isDarkMode ? setTheme("light") : setTheme("dark");
  };

  useEffect(() => {
    if (renditionRef?.current) {
      renditionRef?.current.themes.fontSize(`${fontSize}%`);
      updateTheme(renditionRef.current, theme);
    }
  }, [fontSize, renditionRef, theme]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm font-medium">Font Size</span>
        <Slider
          value={[fontSize]}
          onValueChange={(value) => setFontSize(value[0])}
          min={80}
          max={200}
          step={1}
          className="w-[100px]"
        />
      </div>

      <Button variant="outline" size="icon" onClick={toggleDarkMode}>
        {isDarkMode ? (
          <Sun className="h-[1.2rem] w-[1.2rem]" />
        ) : (
          <Moon className="h-[1.2rem] w-[1.2rem]" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
      {onClose && (
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      )}
    </div>
  );
};
