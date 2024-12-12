import BookInfo from "@/features/books/components/book-info";

type BookDetailPageProps = {
  params: {
    bookId: string;
  };
};

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  return <BookInfo bookId={params.bookId} />;
}
