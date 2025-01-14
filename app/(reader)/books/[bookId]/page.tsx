import BookInformation from "@/features/books/components/book-information";

type BookWithIdProps = {
  params: Promise<{ bookId: string }>;
};

export default async function BookWithId({ params }: BookWithIdProps) {
  const bookId = (await params).bookId;

  return <BookInformation bookId={bookId} />;
}
