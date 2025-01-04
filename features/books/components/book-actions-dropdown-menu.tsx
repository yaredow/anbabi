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
import { useChangeBookStatus } from "../api/use-change-book-status";
import { StatusType } from "../schemas";
import { formatStatus } from "@/lib/utils";
import { useBookStore } from "../store/book-store";

export default function BookActionsDropdownMenu() {
  const { deleteBook, isPending: isDeleteBookPending } = useDeleteBook();
  const { changeStatus, isPending: isChangeBookStatusPending } =
    useChangeBookStatus();

  const queryClient = useQueryClient();
  const { bookId } = useBookStore();
  console.log({ bookId });

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

  const handleChangeStatus = (status: StatusType) => {
    changeStatus(
      { param: { bookId }, query: { status } },
      {
        onSuccess: () => {
          toast({
            description: "Book status updated successfully",
          });
        },
      },
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal className="size-4 font-semibold" />
        <span className="sr-only">Open menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Open</DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleBookDelete}
          disabled={isDeleteBookPending}
        >
          Remove
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {statuses.map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => handleChangeStatus(status)}
                disabled={isChangeBookStatusPending}
              >
                {formatStatus(status)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
