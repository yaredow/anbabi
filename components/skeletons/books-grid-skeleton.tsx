import BookCardSkeleton from "./book-card-skeleton";

export default function BooksGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {[...Array(12)].map((_, index) => (
        <BookCardSkeleton key={index} />
      ))}
    </div>
  );
}
