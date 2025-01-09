"use client";

import React from "react";
import Link from "next/link";
import {
  Book,
  ChevronDown,
  FolderOpen,
  Library,
  Upload,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useMedia } from "react-use";
import { BookCategories, Libraries } from "@/features/books/constants";
import Image from "next/image";
import { useGetCategoriesCount } from "@/features/books/api/use-get-categories-count";
import { UserButton } from "@/features/auth/components/user-button";
import { formatStatus } from "@/lib/utils";

function BookReaderSidebarContent() {
  const { count } = useGetCategoriesCount();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center justify-center">
          <Image src={`/images/logo.svg`} alt="logo" height={45} width={145} />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <Collapsible defaultOpen>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel>
                <FolderOpen className="mr-2 h-4 w-4" />
                Categories
                <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {BookCategories.map((category) => {
                    const categoryCount =
                      category.name === "All"
                        ? count?.totalBooks || 0
                        : count?.categoryCount?.[category.name.toLowerCase()] ||
                          0;

                    return (
                      <SidebarMenuItem key={category.name}>
                        <SidebarMenuButton asChild>
                          <Link
                            href={`/category/${category.name.toLowerCase()}`}
                          >
                            <Book className="mr-2 h-4 w-4" />
                            <span>{category.name}</span>
                            <span className="ml-auto text-xs text-muted-foreground">
                              {categoryCount}
                            </span>
                          </Link>
                        </SidebarMenuButton>{" "}
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
        <SidebarGroup>
          <Collapsible defaultOpen>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel>
                <Library className="mr-2 h-4 w-4" />
                Libraries
                <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {Libraries.map((library) => {
                    const libarayCount =
                      count?.libraryCount[library.status] || 0;
                    return (
                      <SidebarMenuItem key={library.name}>
                        <SidebarMenuButton asChild>
                          <Link
                            href={`/library/${library.name.toLowerCase().replace(" ", "_")}`}
                          >
                            <Book className="mr-2 h-4 w-4" />
                            <span>{formatStatus(library.name)}</span>
                            <span className="ml-auto text-xs text-muted-foreground">
                              {libarayCount}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserButton />
      </SidebarFooter>
    </>
  );
}

export function AppSidebar() {
  const isDesktop = useMedia("(min-width: 1024px)", true);

  if (!isDesktop) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed top-4 left-4 z-40"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <BookReaderSidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sidebar className="hidden md:block">
      <BookReaderSidebarContent />
      <SidebarRail />
    </Sidebar>
  );
}
