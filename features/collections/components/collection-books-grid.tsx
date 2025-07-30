import BookCard from "@/features/books/components/book-card";
import { Book } from "@prisma/client";

interface BookGridProps {
	books: Book[];
	onRemoveBook: (bookId: string) => void;
}

export default function BookGrid({ books, onRemoveBook }: BookGridProps) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
			{books.map((book) => (
				<BookCard
					key={book.id}
					id={book.id}
					bookUrl={book.coverImage as string}
					title={book.title}
					progress={10}
				/>
			))}
		</div>
	);
}
