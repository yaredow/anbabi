"use client";

import { Button } from "@/components/ui/button";
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
    <main className="min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-screen-2xl">
        <nav className="flex items-center justify-between p-3">
          <Link href="/">
            <Image src="/images/logo.svg" alt="logo" width={150} height={56} />
          </Link>
          <Button asChild className="" variant="secondary">
            <Link href={isSignin ? "/sign-up" : "/sign-in"}>
              {isSignin ? "Sign Up" : "Sign In"}
            </Link>
          </Button>
        </nav>
        <main className="bg-muted flex flex-col items-center justify-center w-full h-full">
          {children}
        </main>
      </div>
    </main>
  );
}
