import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { statuses } from "../constants";
import { useDeleteBook } from "../api/use-delete-book";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

export default function BookActionsDropdownMenu() {
  const { deleteBook, isPending } = useDeleteBook();

  const queryClient = useQueryClient();

  const handleBookDelete = () => {
    deleteBook(
      { param: { bookId } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["books"] });
          toast({
            variant: "destructive",
            description: "Book removed successfully",
          });
        },
      },
    );
  };

  const handleChangeStatus = () => {};

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal className="size-4 font-semibold" />
        <span className="sr-only">Open menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Open</DropdownMenuItem>
        <DropdownMenuItem onClick={handleBookDelete} disabled={isPending}>
          Remove
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {statuses.map((status) => (
              <DropdownMenuItem key={status} onClick={handleChangeStatus}>
                {status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
