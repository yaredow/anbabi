import { useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";

import { toast } from "@/hooks/use-toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useChangeBookStatus } from "../api/use-change-book-status";
import { useDeleteBook } from "../api/use-delete-book";
import { useBookStore } from "../store/book-store";
import { formatStatus } from "@/lib/utils";
import { statuses } from "../constants";
import { StatusType } from "../schemas";
import { useBookReaderModal } from "../hooks/use-book-reader-modal";
import { useGetBook } from "../api/use-get-book";
import { useConfirm } from "@/hooks/use-confirm";

export default function BookActionsDropdownMenu() {
  const { deleteBook, isPending: isDeleteBookPending } = useDeleteBook();
  const { changeStatus, isPending: isChangeBookStatusPending } =
    useChangeBookStatus();

  const queryClient = useQueryClient();
  const { bookId } = useBookStore();
  const { book } = useGetBook({ bookId });
  const { open } = useBookReaderModal();

  const [ConfirmationDialog, confirm] = useConfirm({
    title: "Delete project",
    message: "Are you sure you want to delete this project?",
    variant: "destructive",
  });

  const handleBookDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteBook(
        { param: { bookId } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["books"] });
            queryClient.invalidateQueries({ queryKey: ["counts"] });
            toast({
              variant: "destructive",
              description: "Book removed successfully",
            });
          },
        },
      );
    }
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
    <>
      <ConfirmationDialog />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreHorizontal className="size-4 font-semibold" />
          <span className="sr-only">Open menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={open}>Open</DropdownMenuItem>
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
                  className={`${book?.status === status && "bg-muted"}`}
                >
                  {book?.status === status && "✓  "}
                  {formatStatus(status)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
