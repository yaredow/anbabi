import { BooksGrid } from "@/features/books/components/books-grid";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type PageWithStatusProps = {
  params: Promise<{ status: string }>;
};

export default async function PageWithStatus({ params }: PageWithStatusProps) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/sign-in");

  const { status } = await params;

  return <BooksGrid status={status} />;
}
