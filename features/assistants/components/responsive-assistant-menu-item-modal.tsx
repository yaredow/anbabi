import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAssistantMenuItemModal } from "../hooks/use-assitant-menu-item-modal";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

type ResponsiveAssistantItemModalProps = {
  children: React.ReactNode;
};

export default function ResponsiveAssistantItemModal({
  children,
}: ResponsiveAssistantItemModalProps) {
  const { isOpen, setIsOpen } = useAssistantMenuItemModal();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DialogHeader>
        <VisuallyHidden>
          <DialogTitle>Title</DialogTitle>
        </VisuallyHidden>
      </DialogHeader>

      <DialogContent
        className="w-[16rem] md:h-72 sm:max-w-lg p-0 border-none overflow-hidden hide-scrollbar 
             fixed top-1/2 right-1/2 transform -translate-y-1/2 -translate-x-1/2 
             sm:w-[20rem] sm:h-full sm:rounded-none sm:border-l sm:shadow-lg"
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}
