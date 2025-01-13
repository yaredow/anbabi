import { Card, CardContent } from "@/components/ui/card";
import { useGetBooks } from "@/features/books/api/use-get-books";
import { StatusType } from "@/features/books/schemas";
import { Loader2 } from "lucide-react";
import CreateCollectionForm from "./create-collection-form";

type CreateCollectionWrapperProps = {
  onCancel: () => void;
};

export default function CreateCollectionWrapper({
  onCancel,
}: CreateCollectionWrapperProps) {
  const { books, isPending } = useGetBooks({
    status: StatusType.TO_READ,
    category: "all",
  });

  if (isPending) {
    <Card className="w-full h-[714px] border-none shadow-none">
      <CardContent className="flex items-center justify-center h-full">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </CardContent>
    </Card>;
  }

  return <CreateCollectionForm onCancel={onCancel} books={books || []} />;
}
