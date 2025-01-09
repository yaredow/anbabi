import { BooksGrid } from "@/features/books/components/books-grid";
import { StatusType } from "@/features/books/schemas";

type PageWithStatusProps = {
  params: Promise<{ status: string }>;
};

export default async function PageWithStatus({ params }: PageWithStatusProps) {
  const status = (await params).status;
  return <BooksGrid status={status} />;
}
