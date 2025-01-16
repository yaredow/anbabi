import { Card, CardContent } from "@/components/ui/card";
import { StatusType } from "@/features/books/schemas";
import { Loader2 } from "lucide-react";
import CreateCollectionForm from "./create-collection-form";
import { useGetBooks } from "@/features/books/api/use-get-books";

type CreateCollectionWrapperProps = {
  onCancel: () => void;
};

export default function CreateCollectionWrapper({
  onCancel,
}: CreateCollectionWrapperProps) {
  const { books, isPending } = useGetBooks();

  if (isPending) {
    <Card className="w-full h-[714px] border-none shadow-none">
      <CardContent className="flex items-center justify-center h-full">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </CardContent>
    </Card>;
  }

  return <CreateCollectionForm onCancel={onCancel} books={books || []} />;
}
