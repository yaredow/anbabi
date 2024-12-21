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
        className="w-[19rem] sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar 
                   fixed sm:top-0 sm:right-0 sm:translate-x-0 sm:translate-y-0 
                   sm:w-[20rem] sm:h-full sm:rounded-none sm:border-l 
                   sm:shadow-lg sm:bg-white 
                   left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
                   sm:left-auto"
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}
