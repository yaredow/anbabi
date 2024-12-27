import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@radix-ui/react-select";
import { EllipsisVerticalIcon, NotebookIcon, Settings } from "lucide-react";

export default function ReaderMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <EllipsisVerticalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="justify-end">
        <DropdownMenuItem className="flex items-center justify-center gap-2">
          <NotebookIcon />
          <span>Annotation</span>
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem className="flex items-center justify-center gap-2">
          <Settings />
          <span>Settings</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
