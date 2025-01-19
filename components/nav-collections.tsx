"use client";

import { useRouter } from "next/navigation";
import {
  Forward,
  MoreHorizontal,
  PencilIcon,
  Plus,
  Trash2,
} from "lucide-react";

import { useConfirm } from "@/hooks/use-confirm";

import { useCreateCollectionModal } from "@/features/collections/hooks/use-create-collection-modal";
import { CollectionAvatar } from "@/features/collections/components/collection-avatar";
import { useDeleteCollection } from "@/features/collections/api/use-delete-collection";
import { useGetCollections } from "@/features/collections/api/use-get-collections";
import { useCollectionId } from "@/features/collections/hooks/useCollectionId";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

export function NavCollections() {
  const { open } = useCreateCollectionModal();
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { collections, isPending } = useGetCollections();
  const { deleteCollection } = useDeleteCollection();
  const collectionId = useCollectionId();

  const [ConfirmationDialog, confirm] = useConfirm({
    title: "Delete collection",
    message: "Are you sure you want to delete this collection?",
    variant: "destructive",
  });

  const handleDeleteCollection = async (collectionId: string) => {
    const ok = await confirm();

    if (ok) {
      deleteCollection(collectionId, {
        onSuccess: () => {
          window.location.href = "/";
        },
        onError: (error) => {
          toast({
            description: error.message || "Failed to delete collection",
          });
        },
      });
    }
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <ConfirmationDialog />
      <SidebarGroupLabel>Collections</SidebarGroupLabel>
      <SidebarGroupAction title="Add collections" onClick={open}>
        <Plus /> <span className="sr-only">Add collections</span>
      </SidebarGroupAction>

      <SidebarMenu>
        {collections?.map((collection) => (
          <Link href={`/collections/${collection.id}`} key={collection.id}>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={collectionId === collection.id}
                className="mt-2"
                asChild
              >
                <CollectionAvatar
                  collectionId={collection.id}
                  name={collection.name}
                  image={collection.image || ""}
                  description={collection.description || ""}
                />
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem
                    onClick={(Event: React.MouseEvent) => {
                      Event.stopPropagation();
                      router.push(`/projects/${collection.id}/settings`);
                    }}
                  >
                    <PencilIcon className="text-muted-foreground" />
                    <span>Edit collection</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Forward className="text-muted-foreground" />
                    <span>Share collection</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    disabled={isPending}
                    onClick={async (Event: React.MouseEvent) => {
                      Event.stopPropagation();
                      handleDeleteCollection(collection.id);
                    }}
                  >
                    <Trash2 className="text-muted-foreground" />
                    <span>Delete collection</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </Link>
        ))}
        {/* <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem> */}
      </SidebarMenu>
    </SidebarGroup>
  );
}
