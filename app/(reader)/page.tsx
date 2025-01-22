import { BooksGrid } from "@/features/books/components/books-grid";
import { getAllBooks } from "@/features/books/queries";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id as string;

  const books = await getAllBooks(userId);

  if (!books || books.length === 0) {
    return (
      <div className=" items-center justify-center mx-auto">
        No books available. Start by uploading
      </div>
    );
  }

  return <BooksGrid books={books} />;
}
