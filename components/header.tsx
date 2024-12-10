import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground py-2">
      <div className="container mx-auto px-4 flex items-center gap-x-4">
        <Image src="/images/logo.svg" height={50} width={50} alt="logo" />
        <h1 className="text-2xl font-bold">BookShelf</h1>
      </div>
    </header>
  );
}
