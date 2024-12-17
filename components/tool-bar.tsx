import React, { useEffect, useState } from "react";

import { ITheme, RenditionRef } from "@/features/books/types";
import { fontFamilies, themes } from "@/features/books/constants";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/reader-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

type ToolbarContentProps = {
  fontSize: number;
  setFontSize: (size: number) => void;
  onClose?: () => void;
  renditionRef: RenditionRef | undefined;
};

export const ToolBar: React.FC<ToolbarContentProps> = ({
  fontSize,
  setFontSize,
  renditionRef,
  onClose,
}) => {
  const { theme, setTheme, updateTheme, fontFamily, changeFontFamily } =
    useTheme();

  const handleFontChange = (font) => {
    changeFontFamily(font.name);
    if (renditionRef?.current) {
      renditionRef.current.themes.register("custom", {
        p: { "font-family": font.name },
      });
      renditionRef.current.themes.select("custom");
    }
  };

  useEffect(() => {
    if (renditionRef?.current) {
      renditionRef?.current.themes.fontSize(`${fontSize}%`);
      updateTheme(renditionRef.current, theme);
    }
  }, [fontSize, renditionRef, theme]);

  return (
    <Tabs defaultValue="font" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 mb-4 border-b border-border">
        <TabsTrigger
          value="font"
          className="data-[state=active]:text-primary data-[state=active]:font-semibold rounded-none pb-2"
        >
          Font
        </TabsTrigger>
        <TabsTrigger
          value="layout"
          className="data-[state=active]:text-primary data-[state=active]:font-semibold rounded-none pb-2"
        >
          Layout
        </TabsTrigger>
        <TabsTrigger
          value="more"
          className="data-[state=active]:text-primary data-[state=active]:font-semibold rounded-none pb-2"
        >
          More
        </TabsTrigger>
      </TabsList>
      <TabsContent value="font" className="space-y-4"></TabsContent>
      <TabsContent value="font" className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium leading-none mb-4">Font Family</h3>
          <div className="flex flex-wrap gap-4">
            {fontFamilies.map((font) => (
              <div
                key={font.name}
                className={`flex flex-col items-center cursor-pointer transition-colors duration-200 ${
                  fontFamily === font.name
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
                onClick={() => handleFontChange(font)}
              >
                <span
                  className="text-2xl mb-1"
                  style={{ fontFamily: font.name }}
                >
                  Aa
                </span>
                <span className="text-xs">{font.name}</span>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>
      <TabsContent value="more" className="space-y-4">
        {/* More content will go here */}
      </TabsContent>
      {onClose && (
        <Button variant="outline" onClick={onClose} className="mt-4 w-full">
          Close
        </Button>
      )}
    </Tabs>
  );
};
