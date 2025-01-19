"use client";

import { useMedia } from "react-use";
import { Menu } from "lucide-react";
import Image from "next/image";

import { UserButton } from "@/features/auth/components/user-button";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { NavCollections } from "./nav-collections";
import { Button } from "./ui/button";
import { NavMain } from "./nav-main";
import { Suspense } from "react";

const BookReaderSidebarContent = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Image src="/images/logo.svg" alt="logo" height={45} width={145} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <Suspense fallback={<div>Loading...</div>}>
          <NavCollections />
        </Suspense>
      </SidebarContent>
      <SidebarFooter>
        <UserButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

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
        <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
          <Sidebar className="border-none">
            <BookReaderSidebarContent />
          </Sidebar>
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
