import { BookOpen } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground py-4">
      <div className="container mx-auto px-4 flex items-center">
        <BookOpen className="mr-2" />
        <h1 className="text-2xl font-bold">BookShelf</h1>
      </div>
    </header>
  );
}
