"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { useCategoryName } from "@/features/books/hooks/use-category-name";
import { BookCategories } from "@/features/books/constants";

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

type NavCategoryProps = {
  categoryCount: Record<string, number>;
  totalBook: number;
};

export function NavCategory({ categoryCount }: NavCategoryProps) {
  const categoryName = useCategoryName();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Categories</SidebarGroupLabel>
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
                {BookCategories.map((category) => (
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
                          {categoryCount[category.name.toLowerCase()] || 0}
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
