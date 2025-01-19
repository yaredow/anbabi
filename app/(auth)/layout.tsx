"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  const pathName = usePathname();
  const isSignin = pathName === "/sign-in";

  return (
    <main className=" bg-neutral-100 min-h-screen">
      <div className=" mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between">
          <Image src="/images/logo.svg" alt="logo" width={150} height={56} />
          <Button asChild className="" variant="secondary">
            <Link href={isSignin ? "/sign-up" : "/sign-in"}>
              {isSignin ? "Sign Up" : "Sign In"}
            </Link>
          </Button>
        </nav>
        <div
          className={cn(
            "flex flex-col pt-4 max-w-3xl mx-auto items-center justify-center",
            isSignin ? "md:pt-14" : "md:pt-12",
          )}
        >
          {children}
        </div>
      </div>
    </main>
  );
}
