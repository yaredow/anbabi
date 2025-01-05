import { UserButton } from "@/features/auth/components/user-button";
import Image from "next/image";
import Link from "next/link";
import { type ReactElement } from "react";

type StandaloneLayoutProps = {
  children: React.ReactNode;
};

export default function StandaloneLayout({
  children,
}: StandaloneLayoutProps): ReactElement {
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between h-[73px]">
          <Link href="/">
            <Image src="/images/logo.svg" alt="logo" height={56} width={152} />
          </Link>
        </nav>
        <div className="flex flex-col items-center justify-center py-4">
          {children}
        </div>
      </div>
    </main>
  );
}
