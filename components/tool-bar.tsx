import React, { useEffect } from "react";
import { Check } from "lucide-react";

import { ITheme, RenditionRef } from "@/features/books/types";
import { fontFamilies, themes } from "@/features/books/constants";

import { useBookStore } from "@/features/books/store/book-store";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import DottedSeparator from "./dotted-separator";

import { Slider } from "./ui/slider";

type ToolbarContentProps = {
  onClose?: () => void;
  renditionRef: RenditionRef | undefined;
};

export const ToolBar: React.FC<ToolbarContentProps> = ({
  renditionRef,
  onClose,
}) => {
  const {
    theme,
    setTheme,
    updateTheme,
    fontSize,
    setFontSize,
    updateFontSize,
    fontFamily,
    setFontFamily,
    updateFontFamily,
  } = useBookStore();

  const handleFontChange = (font: string) => {
    setFontFamily(font);
  };

  useEffect(() => {
    if (renditionRef?.current) {
      updateFontSize(renditionRef.current, fontSize);
      updateTheme(renditionRef.current, theme);
      updateFontFamily(renditionRef.current, fontFamily);
    }
  }, [
    fontSize,
    fontFamily,
    renditionRef,
    theme,
    updateTheme,
    updateFontSize,
    updateFontFamily,
  ]);

  return (
    <Tabs defaultValue="font" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 mb-4 border-b border-border">
        <TabsTrigger
          value="font"
          className="data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-2 transition-all"
        >
          Font
        </TabsTrigger>
        <TabsTrigger
          value="layout"
          className="data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-2 transition-all"
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
      <TabsContent value="font" className="space-y-4">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-4">
            {fontFamilies.map((font) => {
              return (
                <div
                  key={font.name}
                  className={`flex flex-col items-center cursor-pointer transition-colors duration-200 ${
                    fontFamily === font.name
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                  onClick={() => handleFontChange(font.name)}
                >
                  <span
                    className={`text-xl font-semibold ${fontFamily === font.name && "underline underline-offset-4"}`}
                    style={{ fontFamily: font.name }}
                  >
                    Aa
                  </span>
                  <span className="text-xs">{font.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        <DottedSeparator />

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm">A</span>
            <Slider
              value={[fontSize]}
              onValueChange={(value) => setFontSize(value[0])}
              min={80}
              max={200}
              step={10}
              className="flex-grow"
            />
            <span className="text-xl">A</span>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="layout" className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium leading-none mb-4">Theme</h3>
          <div className="flex flex-wrap gap-4">
            {themes.map((item) => (
              <button
                key={item.name}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                  theme === item.name ? "ring-2 ring-primary" : ""
                }`}
                style={{ backgroundColor: item.backgroundColor }}
                onClick={() => setTheme(item.name as ITheme)}
                aria-label={`Set ${item.name} theme`}
              >
                {theme === item.name && (
                  <Check
                    className="h-4 w-4"
                    style={{ color: item.textColor }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* <div className="flex items-center justify-between">
            <span className="text-sm font-normal">
              Update page using system theme
            </span>
            <Switch
              checked={useSystemTheme}
              onCheckedChange={setUseSystemTheme}
              aria-label="Use system theme"
            />
          </div> */}

          {/* <div className="py-4">
            <DottedSeparator />
          </div> */}

          {/* <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Continuous scrolling</span>
            <Switch
              checked={continuousScrolling}
              onCheckedChange={setContinuousScrolling}
              aria-label="Enable continuous scrolling"
            />
          </div> */}
        </div>
      </TabsContent>
      <TabsContent value="more" className="space-y-4"></TabsContent>
      {onClose && (
        <Button variant="outline" onClick={onClose} className="mt-4 w-full">
          Close
        </Button>
      )}
    </Tabs>
  );
};
