import { type ReactElement } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ResponsiveAssistantMenuModalProps = {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ResponsiveAssistantMenuModal({
  children,
  open,
  onOpenChange,
}: ResponsiveAssistantMenuModalProps): ReactElement {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogHeader>
        <VisuallyHidden>
          <DialogTitle>Title</DialogTitle>
        </VisuallyHidden>
      </DialogHeader>
      <DialogContent className="w-[19rem] sm:max-w-lg p-0 bordr-none overflow-y-auto  hide-scrollbar">
        {children}
      </DialogContent>
    </Dialog>
  );
}
