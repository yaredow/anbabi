"use client";

import { RiAddCircleFill } from "react-icons/ri";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { CollectionAvatar } from "./collection-avatar";
import { useGetCollections } from "../api/use-get-collections";
import { useCreateCollectionModal } from "../hooks/use-create-collection-modal";
import { useCollectionId } from "../hooks/useCollectionId";
import { Loader2 } from "lucide-react";

export default function WorkspaceSwitcher() {
  const { open } = useCreateCollectionModal();
  const { collections, isPending } = useGetCollections();
  const collectionId = useCollectionId();
  const router = useRouter();

  const onSelect = (workspaceId: string) => {
    router.push(`/workspaces/${workspaceId}`);
  };

  if (isPending) {
    return (
      <Loader2 className="flex items-center justify-center mx-auto animate-spin" />
    );
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Workspaces</p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      <Select onValueChange={onSelect} value={collectionId}>
        <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>
        <SelectContent>
          {collections?.map((collection) => (
            <SelectItem key={collection.id} value={collection.id}>
              <div className="flex justify-start items-center gap-3 font-medium">
                <CollectionAvatar
                  collectionId={collection.id}
                  description={collection.description || ""}
                  name={collection.name}
                  image={collection.image || ""}
                />
                <p className="text-sm">{collection.name}</p>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
