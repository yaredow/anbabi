import BookInformation from "@/features/books/components/book-information";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const bookId = (await params).bookId;
  return <BookInformation bookId={bookId} />;
}
