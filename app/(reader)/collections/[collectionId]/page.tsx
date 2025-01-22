import { ArrowLeft, PencilIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";

import { getCollection } from "@/features/collections/queries";

import CollectionSwitcher from "@/features/collections/components/collection-switcher";
import CollectionBooksList from "@/features/collections/components/collection-books-list";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

type IParams = {
  params: Promise<{ collectionId: string }>;
};

export async function generateMetadata({ params }: IParams) {
  const { collectionId } = await params;
  const collection = await getCollection(collectionId);

  return {
    title: `${collection?.name}`,
  };
}

export default async function PageWithCollectionId({ params }: IParams) {
  const { collectionId } = await params;

  return (
    <div className="flex flex-col space-y-4 w-full">
      <Link
        href="/"
        className="inline-flex gap-2 items-center text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        <span>Back to Library</span>
      </Link>

      <div className="flex items-center justify-between">
        <CollectionSwitcher />

        <Button variant="secondary" size="sm" asChild>
          <Link href={`/collections/${collectionId}/settings`}>
            <PencilIcon strokeWidth={1.5} size={20} className="siz-4 mr-2" />
            <span className="font-semibold text-sm">Edit collection</span>
          </Link>
        </Button>
      </div>

      <CollectionBooksList />
    </div>
  );
}
