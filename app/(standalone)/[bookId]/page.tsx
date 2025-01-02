import BookInfo from "@/features/books/components/book-info";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const bookId = (await params).bookId;
  return <BookInfo bookId={bookId} />;
}
