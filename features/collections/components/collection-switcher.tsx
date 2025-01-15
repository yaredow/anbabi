"use client";

import { useRouter } from "next/navigation";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";

import { useCreateCollectionModal } from "../hooks/use-create-collection-modal";
import { useGetCollections } from "../api/use-get-collections";
import { useCollectionId } from "../hooks/useCollectionId";
import { CollectionAvatar } from "./collection-avatar";

export default function CollectionSwitcher() {
  const { collections, isPending } = useGetCollections();
  const collectionId = useCollectionId();
  const router = useRouter();

  const onSelect = (collectionId: string) => {
    router.push(`/collections/${collectionId}`);
  };

  return (
    <div className="flex flex-col gap-y-2">
      <Select onValueChange={onSelect} value={collectionId}>
        <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>
        <SelectContent>
          {collections?.map((collection) => (
            <SelectItem key={collection.id} value={collection.id}>
              <div className="flex justify-start items-center gap-3 font-medium">
                <CollectionAvatar
                  name={collection.name}
                  collectionId={collection.id}
                  image={collection.image || ""}
                />
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
