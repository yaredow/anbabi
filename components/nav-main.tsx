"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { useCategoryName } from "@/features/books/hooks/use-category-name";
import { BookCategories, Libraries } from "@/features/books/constants";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useGetCategoriesCount } from "@/features/books/api/use-get-categories-count";
import { useBookStatus } from "@/features/books/hooks/use-book-status";

export function NavMain() {
  const categoryName = useCategoryName();
  const status = useBookStatus();
  const { count } = useGetCategoriesCount();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Browse</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible asChild className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton>
                <span>Categories</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {BookCategories.map((category) => {
                  const categoryCount = count?.categoryCount;
                  return (
                    <SidebarMenuSubItem key={category.name}>
                      <SidebarMenuSubButton
                        isActive={categoryName === category.name.toLowerCase()}
                        asChild
                      >
                        <Link
                          href={`/category/${category.name.toLowerCase()}`}
                          className="flex items-center justify-between"
                        >
                          <span>{category.name}</span>
                          <span className="ml-auto">
                            {category.name.toLowerCase() === "all"
                              ? count?.totalBooks || 0
                              : categoryCount?.[category.name.toLowerCase()] ||
                                0}
                          </span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>

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
                {Libraries.map((library) => {
                  const libraryCount = count?.libraryCount;

                  return (
                    <SidebarMenuSubItem key={library.name}>
                      <SidebarMenuSubButton
                        isActive={status === library.status.toLowerCase()}
                        asChild
                      >
                        <Link
                          href={`/library/${library.status.toLowerCase()}`}
                          className="flex items-center justify-between"
                        >
                          <span>{library.name}</span>
                          <span className="ml-auto">
                            {libraryCount?.[library.status] || 0}
                          </span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}
