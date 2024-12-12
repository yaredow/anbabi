import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { type ReactElement } from "react";
import { useMedia } from "react-use";
import { useState } from "react";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Maximize2, Minimize2, X } from "lucide-react";
import { Button } from "./ui/button";

type ResponsiveModalProps = {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ResponsiveReaderModal({
  open,
  onOpenChange,
  children,
}: ResponsiveModalProps): ReactElement {
  const isDesktop = useMedia("(min-width: 1024px)", true);
  const [isMaximized, setIsMaximized] = useState(false);

  const handleMaximizeToggle = () => setIsMaximized((prev) => !prev);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Reader</DialogTitle>
          </DialogHeader>
        </VisuallyHidden>
        <DialogContent
          className={`relative p-0 border-none overflow-hidden ${
            isMaximized
              ? "w-screen h-screen max-w-none max-h-none"
              : "w-[375px] h-[667px] max-w-none max-h-none" // Smartphone-like size
          }`}
        >
          {/* Maximize and Close Buttons */}
          <div className="absolute top-2 right-2 z-10 flex gap-2">
            <Button onClick={handleMaximizeToggle} variant="link">
              {isMaximized ? (
                <Minimize2 className="size-3" />
              ) : (
                <Maximize2 className="size-3" />
              )}
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              variant="link"
              className="text-red-500"
            >
              <X className="size-3" />
            </Button>
          </div>

          {/* React Reader Content */}
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="w-full h-screen p-0 overflow-y-auto">
        <div className="absolute top-2 right-2 z-10">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-red-200 ml-2 rounded px-3 py-1 text-sm"
          >
            <X className="size-4" />
          </Button>
        </div>
        {children}
      </DrawerContent>
    </Drawer>
  );
}
