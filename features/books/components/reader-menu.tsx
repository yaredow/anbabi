import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  EllipsisVerticalIcon,
  Maximize2,
  NotebookIcon,
  Settings,
  X,
} from "lucide-react";
import { useBookReaderModal } from "../hooks/use-book-reader-modal";
import { useToolBarModal } from "@/hooks/use-tool-bar-modal";
import { useAnnotationModal } from "@/features/annotations/hooks/use-annotation-modal";
import { useState } from "react";

type ReaderMenuProps = {
  handleMaximizeToggle: () => void;
};

export default function ReaderMenu({ handleMaximizeToggle }: ReaderMenuProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { close } = useBookReaderModal();
  const { open: openToolBar } = useToolBarModal();
  const { open: openAnnotationModal } = useAnnotationModal();

  const handleOpenSettings = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsOpen(false);
    openToolBar();
  };

  const handleOpenAnnotations = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsOpen(false);
    openAnnotationModal();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <EllipsisVerticalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-10">
        <DropdownMenuItem
          className="flex items-center justify-center gap-2"
          onClick={handleMaximizeToggle}
        >
          <Maximize2 />
          <span>Maximize</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center justify-center gap-2"
          onClick={handleOpenAnnotations}
        >
          <NotebookIcon />
          <span>Annotations</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center justify-center gap-2"
          onClick={handleOpenSettings}
        >
          <Settings />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center justify-center gap-2"
          onClick={() => close()}
        >
          <X />
          <span>Close</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
