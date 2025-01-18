import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

import BookInformation from "@/features/books/components/book-information";
import { Suspense } from "react";

export default async function BookWithId() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/sign-in");

  return (
    <Suspense>
      <BookInformation />
    </Suspense>
  );
}
