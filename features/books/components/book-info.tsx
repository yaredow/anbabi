"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function BookInfo({ book }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <ScrollArea className={`${isExpanded ? "h-64" : "h-32"} mb-4`}>
        <p className="text-gray-700">{book.description}</p>
      </ScrollArea>
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-center"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="mr-2 h-4 w-4" /> Show Less
          </>
        ) : (
          <>
            <ChevronDown className="mr-2 h-4 w-4" /> Show More
          </>
        )}
      </Button>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
        <dt className="text-sm font-medium text-gray-500">Publisher</dt>
        <dd className="text-sm text-gray-900">{book.publisher}</dd>
        <dt className="text-sm font-medium text-gray-500">Publication Date</dt>
        <dd className="text-sm text-gray-900">{book.publicationDate}</dd>
        <dt className="text-sm font-medium text-gray-500">ISBN</dt>
        <dd className="text-sm text-gray-900">{book.isbn}</dd>
        <dt className="text-sm font-medium text-gray-500">Category</dt>
        <dd className="text-sm text-gray-900">{book.category}</dd>
        <dt className="text-sm font-medium text-gray-500">Genre</dt>
        <dd className="text-sm text-gray-900">{book.genre}</dd>
      </dl>
    </div>
  );
}
