import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Settings } from "lucide-react";
import { useMedia } from "react-use";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";

import { Button } from "./ui/button";

type ResponsiveToolBarModalProps = {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ResponsiveToolBarModal({
  open,
  onOpenChange,
  children,
}: ResponsiveToolBarModalProps) {
  const isDesktop = useMedia("(min-width: 1024px)", true);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>Title</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed top-4 right-4 z-10"
          >
            <Settings className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Open settings</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">{children}</DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 left-4 z-10"
        >
          <Settings className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Open settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">{children}</SheetContent>
    </Sheet>
  );
}
