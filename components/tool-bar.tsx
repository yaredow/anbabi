import React, { useEffect } from "react";
import { Rendition } from "epubjs";

import { ITheme, RenditionRef } from "@/features/books/types";
import { themes } from "@/features/books/constants";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useTheme } from "@/context/reader-theme-context";

type ToolbarContentProps = {
  fontSize: number;
  setFontSize: (size: number) => void;
  onClose?: () => void;
  renditionRef: RenditionRef | undefined;
  updateTheme: (rendition: Rendition, theme: ITheme) => void;
};

export const ToolBar: React.FC<ToolbarContentProps> = ({
  fontSize,
  setFontSize,
  updateTheme,
  renditionRef,
  onClose,
}) => {
  const { theme, setTheme } = useTheme();

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

      <div className="space-y-2">
        <h3 className="text-sm font-medium leading-none">Theme</h3>
        <div className="flex space-x-2">
          {themes.map((item) => (
            <button
              key={item.name}
              className={`rounded-full w-8 h-8 p-0 ${
                theme === item.name ? "ring-2 ring-primary" : ""
              }`}
              style={{ backgroundColor: item.backgroundColor }}
              onClick={() => setTheme(item.name as ITheme)}
              aria-label={`Set ${item.name} theme`}
            >
              {theme === item.name && (
                <span className="h-4 w-4" style={{ color: item.textColor }}>
                  ✔
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      {onClose && (
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      )}
    </div>
  );
};
