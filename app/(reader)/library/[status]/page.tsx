import { BooksGrid } from "@/features/books/components/books-grid";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function PageWithStatus() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/sign-in");

  return <BooksGrid />;
}
