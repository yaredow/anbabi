"use client";

import {
  Book,
  BookOpen,
  FolderOpen,
  Library,
  LogOut,
  Settings,
  User,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Image from "next/image";
import { NavUser } from "./nav-user";

const categories = [
  { name: "Fiction", count: 120 },
  { name: "Non-Fiction", count: 85 },
  { name: "Science Fiction", count: 45 },
  { name: "Mystery", count: 38 },
  { name: "Biography", count: 22 },
];

const libraries = [
  { name: "Favorites", count: 15 },
  { name: "To Read", count: 28 },
  { name: "Currently Reading", count: 3 },
  { name: "Completed", count: 67 },
];

function ReaderSidebar() {
  return (
    <>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Image
                src="/images/logo.svg"
                alt="logo"
                height={40}
                width={164}
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
                  <a href="/books">
                    <Book className="mr-2 h-4 w-4" />
                    <span>All Books</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((category) => (
                <SidebarMenuItem key={category.name}>
                  <SidebarMenuButton asChild>
                    <a href={`/category/${category.name.toLowerCase()}`}>
                      <FolderOpen className="mr-2 h-4 w-4" />
                      <span>{category.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {category.count}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>My Libraries</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {libraries.map((library) => (
                <SidebarMenuItem key={library.name}>
                  <SidebarMenuButton asChild>
                    <a
                      href={`/library/${library.name.toLowerCase().replace(" ", "-")}`}
                    >
                      <Library className="mr-2 h-4 w-4" />
                      <span>{library.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {library.count}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <NavUser
              user={{
                name: "Yarred Yilma",
                email: "yaredyilma11@gmail.com",
                avatar:
                  "https://pbs.twimg.com/profile_images/1854956005391532033/aLu4S0pU_400x400.jpg",
              }}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
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
