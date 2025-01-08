"use client";

import { Book, ChevronDown, FolderOpen, Library, LogIn } from "lucide-react";
import { FaBook } from "react-icons/fa";

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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Image from "next/image";
import { UserButton } from "../features/auth/components/user-button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useSession } from "@/lib/auth-client";
import { Button } from "./ui/button";
import Link from "next/link";
import { useGetCategoriesCount } from "@/features/books/api/use-get-categories-count";
import { useGetBooks } from "@/features/books/api/use-get-books";

const categories = [
  { name: "Fiction" },
  { name: "Non-Fiction" },
  { name: "Science-fiction" },
  { name: "Mystery" },
  { name: "Biography" },
];

const libraries = [
  { name: "Favorites", count: 15 },
  { name: "To Read", count: 28 },
  { name: "Currently Reading", count: 3 },
  { name: "Completed", count: 67 },
];

function ReaderSidebar() {
  const { data: session } = useSession();
  const { count, isPending } = useGetCategoriesCount();
  const { books } = useGetBooks({ category: "all" });

  return (
    <>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Image
                src="/images/logo.svg"
                alt="logo"
                width={164}
                height={45}
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/category/all">
                    <FaBook className="mr-2 h-4 w-4" />
                    <span>All books</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {books?.length || 0}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Collapsible defaultOpen>
          <SidebarGroup>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="flex items-center justify-between">
                Categories
                <ChevronDown className="h-4 w-4 transition-transform duration-200" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {categories.map((category) => {
                    const categoryCount =
                      count?.[category.name.toLowerCase()] || 0;
                    return (
                      <SidebarMenuItem key={category.name}>
                        <SidebarMenuButton asChild>
                          <Link
                            href={`/category/${category.name.toLowerCase()}`}
                          >
                            <FolderOpen className="mr-2 h-4 w-4" />
                            <span>{category.name}</span>
                            <span className="ml-auto text-xs text-muted-foreground">
                              {categoryCount}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        <Collapsible defaultOpen>
          <SidebarGroup>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="flex items-center justify-between">
                My Libraries
                <ChevronDown className="h-4 w-4 transition-transform duration-200" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {libraries.map((library) => (
                    <SidebarMenuItem key={library.name}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={`/library/${library.name.toLowerCase().replace(" ", "-")}`}
                        >
                          <Library className="mr-2 h-4 w-4" />
                          <span>{library.name}</span>
                          <span className="ml-auto text-xs text-muted-foreground">
                            {library.count}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-center w-full px-4 py-2">
              {session ? (
                <UserButton />
              ) : (
                <Link href="/sign-in" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:text-neutral-200 transition-colors duration-200"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign in
                  </Button>
                </Link>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>{" "}
    </>
  );
}

export default function AppSidebar() {
  const { isMobile } = useSidebar();

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <SidebarTrigger />
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] p-0">
          <Sidebar className="border-r-0">
            <ReaderSidebar />
          </Sidebar>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sidebar>
      <ReaderSidebar />
      <SidebarRail />
    </Sidebar>
  );
}
