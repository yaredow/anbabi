import { Plus, Search } from "lucide-react";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="flex w-full sticky top-0 items-center justify-between p-2">
      <Button variant="ghost">
        <Plus className="size-6" />
      </Button>
      <div className="flex items-center gap-4">
        <h1 className="text-sm">Library</h1>
      </div>
      <Button variant="ghost">
        <Search className="size-6" />
      </Button>
    </header>
  );
}
