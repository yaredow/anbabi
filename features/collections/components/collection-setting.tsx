import { Collection } from "@prisma/client";
import { getBooksWithCollectionId, getCollection } from "../queries";
import UpdatedCollectionForm from "./updated-collection-form";

type CollectionSettingProps = {
  collectionId: string;
};

export default async function CollectionSetting({
  collectionId,
}: CollectionSettingProps) {
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
