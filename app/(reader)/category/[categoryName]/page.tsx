import { BooksGrid } from "@/features/books/components/books-grid";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type PageWithCategoryProps = {
  params: Promise<{ categoryName: string }>;
};

export default async function PageWithCategory({
  params,
}: PageWithCategoryProps) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/sign-in");

  const category = (await params).categoryName;

  return <BooksGrid categoryName={category} />;
}
