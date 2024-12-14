import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ModeToggle } from "./model-toggle";
import { RenditionRef } from "@/features/books/types";

type ToolbarContentProps = {
  fontSize: number;
  setFontSize: (size: number) => void;
  onClose?: () => void;
  renditionRef: RenditionRef | null;
};

export const ToolBar: React.FC<ToolbarContentProps> = ({
  fontSize,
  setFontSize,
  renditionRef,
  onClose,
}) => {
  useEffect(() => {
    if (renditionRef?.current) {
      renditionRef?.current.themes.fontSize(`${fontSize}%`);
    }
  }, [fontSize, renditionRef]);

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
      <ModeToggle />
      {onClose && (
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      )}
    </div>
  );
};
