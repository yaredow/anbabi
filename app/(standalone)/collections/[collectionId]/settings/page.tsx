import UpdatedCollectionForm from "@/features/collections/components/updated-collection-form";
import {
  getBooksWithCollectionId,
  getCollection,
} from "@/features/collections/queries";
import { auth } from "@/lib/auth";
import { Collection } from "@prisma/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type CollectionSettingsPageParams = {
  params: Promise<{ collectionId: string }>;
};

export default async function CollectionSettingsPage({
  params,
}: CollectionSettingsPageParams) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  const { collectionId } = await params;

  const initialValues = await getCollection(collectionId);
  const books = await getBooksWithCollectionId(collectionId);

  return (
    <div className="w-full lg:max-w-xl mx-auto">
      <UpdatedCollectionForm
        initialValue={initialValues as Collection}
        books={books || []}
      />
    </div>
  );
}
