"use client";

import { Book, ChevronRight, Library } from "lucide-react";
import { FaBook } from "react-icons/fa6";
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

type NavMainProps = {
  setIsOpen?: (isOpen: boolean) => void;
};

export function NavMain({ setIsOpen }: NavMainProps) {
  const categoryName = useCategoryName();
  const status = useBookStatus();
  const { count } = useGetCategoriesCount();

  const toggleSheet = () => {
    if (setIsOpen) {
      setIsOpen(false);
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Browse</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={!categoryName && !status}>
            <Link href="/" className="flex items-center justify-between">
              <span className="flex items-center justify-center">
                <FaBook className="mr-2 size-4" />
                All books
              </span>
              <span className="ml-auto">{count?.totalBooks || 0}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <Collapsible asChild className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton>
                <span className="flex items-center">
                  <Book className="mr-2 size-4" />
                  Categories
                </span>
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
                        onClick={toggleSheet}
                      >
                        <Link
                          href={`/category/${category.name.toLowerCase()}`}
                          className="flex items-center justify-between"
                        >
                          <span className="flex items-center">
                            {category.name}
                          </span>
                          <span className="ml-auto">
                            {categoryCount?.[category.name.toLowerCase()] || 0}
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
                <span className="flex items-center">
                  <Library className="mr-2 size-4" />
                  Library
                </span>
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
                        onClick={toggleSheet}
                      >
                        <Link
                          href={`/library/${library.status.toLowerCase()}`}
                          className="flex items-center justify-between"
                        >
                          <span className="flex items-center">
                            {library.name}
                          </span>
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
