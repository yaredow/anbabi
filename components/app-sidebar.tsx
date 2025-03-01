"use client";

import { useMedia } from "react-use";
import { Menu } from "lucide-react";
import Image from "next/image";

import { UserButton } from "@/features/auth/components/user-button";
import Link from "next/link";

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
import { Suspense, useState } from "react";
import { useSession } from "@/lib/auth-client";

type SidebarContentsProps = {
  setIsOpen?: (isOpen: boolean) => void;
};

const SidebarContents = ({ setIsOpen }: SidebarContentsProps) => {
  const { data: session } = useSession();

  return (
    <>
      <SidebarHeader>
        <Image src="/images/logo.svg" alt="logo" height={45} width={145} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain setIsOpen={setIsOpen} />
        <Suspense fallback={<div>Loading...</div>}>
          <NavCollections />
        </Suspense>
      </SidebarContent>
      <SidebarFooter>
        {session ? (
          <UserButton />
        ) : (
          <Link className="flex items-center mx-auto" href="/sign-in">
            <Button variant="default" className="px-4 py-2">
              Sign In
            </Button>
          </Link>
        )}
      </SidebarFooter>
    </>
  );
};

export function AppSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isDesktop = useMedia("(min-width: 1024px)", true);

  if (isDesktop) {
    return (
      <Sidebar collapsible="icon" className="hidden md:block">
        <SidebarContents />
        <SidebarRail />
      </Sidebar>
    );
  }

  return (
    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="fixed left-4 z-40">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
        <div className="h-full flex flex-col">
          <SidebarContents setIsOpen={setIsSidebarOpen} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
