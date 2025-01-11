"use client";

import {
  Folder,
  Forward,
  MoreHorizontal,
  PencilIcon,
  Plus,
  Trash2,
  type LucideIcon,
} from "lucide-react";

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
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import { useCreateCollectionModal } from "@/features/collections/hooks/use-create-collection-modal";
import { CollectionAvatar } from "@/features/collections/components/collection-avatar";

export function NavCollections() {
  const { open } = useCreateCollectionModal();
  const { isMobile } = useSidebar();
  const router = useRouter();
  const isPending = false;

  const [ConfirmationDialog, confirm] = useConfirm({
    title: "Delete project",
    message: "Are you sure you want to delete this project?",
    variant: "destructive",
  });

  const handleConfirm = async () => {};

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <ConfirmationDialog />
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarGroupAction title="Add Project" onClick={open}>
        <Plus /> <span className="sr-only">Add Project</span>
      </SidebarGroupAction>

      <SidebarMenu>
        {projects?.map((project) => (
          <SidebarMenuItem key={project.name}>
            <SidebarMenuButton asChild>
              <CollectionAvatar name={project.name} collectionId={"11"} />
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
                    router.push(`/projects/${project.id}/settings`);
                  }}
                >
                  <PencilIcon className="text-muted-foreground" />
                  <span>Edit Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={isPending}
                  onClick={async (Event: React.MouseEvent) => {
                    Event.stopPropagation();
                    handleConfirm();
                  }}
                >
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
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
