import { getCollection } from "@/features/collections/queries";

type IParams = {
  params: Promise<{ collectionId: string }>;
};

export async function generateMetadata({ params }: IParams) {
  const { collectionId } = await params;
  const collection = await getCollection({ collectionId });

  return {
    title: `${collection?.name}`,
  };
}

export default async function PageWithCollectionId({ params }: IParams) {
  const { collectionId } = await params;

  return <div>Collection ID: {collectionId}</div>;
}
