import BookInformation from "@/features/books/components/book-information";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type BookWithIdProps = {
  params: Promise<{ bookId: string }>;
};

export default async function BookWithId({ params }: BookWithIdProps) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/sign-in");

  const bookId = (await params).bookId;

  return <BookInformation bookId={bookId} />;
}
