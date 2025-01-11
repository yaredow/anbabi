"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { BookCategories, Libraries } from "@/features/books/constants";
import Link from "next/link";
import { Collapsible, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";
import { CollapsibleContent } from "./ui/collapsible";

type NavLibraryProps = {
  libaryCount: Record<string, number>;
};

export function NavLibrary({ libaryCount }: NavLibraryProps) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible asChild className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton>
                <span>Library</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {Libraries.map((library) => (
                  <SidebarMenuSubItem key={library.name}>
                    <SidebarMenuSubButton asChild>
                      <Link
                        href={`/category/${library.name.toLowerCase()}`}
                        className="flex items-center justify-between"
                      >
                        <span>{library.name}</span>
                        <span className="ml-auto">
                          ({libaryCount[library.name.toLowerCase()] || 0})
                        </span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}
