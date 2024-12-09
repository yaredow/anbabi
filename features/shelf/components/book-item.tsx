import { Book } from "@/features/books/types";
import Image from "next/image";

interface BookItemProps {
  book: Book;
}

export default function BookItem({ book }: BookItemProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-48 mb-2">
        <Image
          src={book.cover}
          alt={book.title}
          fill
          className="object-cover rounded-md shadow-md"
        />
      </div>
      <h3 className="text-sm font-semibold text-center">{book.title}</h3>
      <p className="text-xs text-muted-foreground text-center">{book.author}</p>
    </div>
  );
}
