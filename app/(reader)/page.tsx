import { getAllBooks } from "@/features/books/queries";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  const books = await getAllBooks(session.user.id);

  if (books?.length === 0) {
    redirect("/upload");
  } else {
    redirect("/category/all");
  }
}
