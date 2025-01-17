import { useMedia } from "react-use";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Sheet, SheetContent, SheetOverlay } from "@/components/ui/sheet";

type ResponsiveAnnotationModalProps = {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ResponsiveAnnotationModal({
  children,
  onOpenChange,
  open,
}: ResponsiveAnnotationModalProps) {
  const isDesktop = useMedia("(min-width: 1024px)", true);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>Title</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        <DialogContent className="w-full sm:max-w-lg p-0 bordr-none overflow-y-auto max-h-[85vh] hide-scrollbar">
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetOverlay />
      <SheetContent className="w-full h-full p-0 border-none overflow-y-auto max-h-[85vh] hide-scrollbar">
        {children}
      </SheetContent>
    </Sheet>
  );
}
