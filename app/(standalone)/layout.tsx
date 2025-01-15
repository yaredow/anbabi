import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

type StandaloneLayoutPr = {
  children: React.ReactNode;
};

export default function StandaloneLayout({ children }: StandaloneLayoutPr) {
  return (
    <main className="min-h-screen">
      <div className=" mx-auto max-w-screen-2xl">
        <nav className="flex items-center justify-between p-3">
          <Link href="/">
            <Image src="/images/logo.svg" alt="logo" width={150} height={56} />
          </Link>
        </nav>
        <main className="bg-muted">{children}</main>
      </div>
    </main>
  );
}
