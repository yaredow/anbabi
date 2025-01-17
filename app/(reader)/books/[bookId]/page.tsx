import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

import BookInformation from "@/features/books/components/book-information";

type BookWithIdProps = {
  params: Promise<{ bookId: string }>;
};

export default async function BookWithId({ params }: BookWithIdProps) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/sign-in");

  const bookId = (await params).bookId;

  return <BookInformation bookId={bookId} />;
}
