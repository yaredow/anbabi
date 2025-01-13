import { getCollection } from "@/features/collections/queries";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type PageWithCollectionIdProps = {
  params: Promise<{ collectionId: string }>;
};

export async function generateMetadata({
  params,
}: PageWithCollectionIdProps): Promise<Metadata> {
  const collectionId = (await params).collectionId;
  const collection = await getCollection({ collectionId });

  if (!collection) {
    return {
      title: "Collection Not Found",
    };
  }

  return {
    title: `${collection.name} | Book Reader`,
  };
}

export default async function PageWithCollectionId({
  params,
}: PageWithCollectionIdProps) {
  const collectionId = (await params).collectionId;

  if (!collectionId) {
    notFound();
  }

  return <main>{collectionId}</main>;
}
