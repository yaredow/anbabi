import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Moon, Sun, Bookmark } from "lucide-react";
import { ModeToggle } from "./model-toggle";

type ToolbarContentProps = {
  fontSize: number;
  setFontSize: (size: number) => void;
  onClose?: () => void;
};

export const ToolBar: React.FC<ToolbarContentProps> = ({
  fontSize,
  setFontSize,
  onClose,
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm font-medium">Font Size</span>
        <Slider
          value={[fontSize]}
          onValueChange={(value) => setFontSize(value[0])}
          min={12}
          max={24}
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
