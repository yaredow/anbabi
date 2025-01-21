"use client";

import { useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useQueryState } from "nuqs";

import { Input } from "@/components/ui/input";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useQueryState("query", {
    defaultValue: "",
  });

  const searchBarRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={searchBarRef} className="w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
        <Input
          type="text"
          placeholder="Search library..."
          value={searchQuery || ""}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-4 py-2"
          autoFocus
        />
      </div>
    </form>
  );
}
