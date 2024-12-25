import React from "react";
import { Loader2, ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useGetWikipedia } from "../api/use-get-wikipedia";

interface WikipediaCardProps {
  selectedText: string;
}

export default function WikipediaCard({ selectedText }: WikipediaCardProps) {
  const { wiki, isPending, error } = useGetWikipedia({ selectedText });

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (!wiki || error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#f8f9fa]">
        <h2 className="text-2xl font-serif text-[#202122]">
          No Wikipedia page found
        </h2>
      </div>
    );
  }

  const page = wiki.query.pages[Object.keys(wiki.query.pages)[0]];

  if (!page) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#f8f9fa]">
        <h2 className="text-2xl font-serif text-[#202122]">
          No Wikipedia page found
        </h2>
      </div>
    );
  }

  const { title, extract, pageid } = page;
  const summary = extract
    ? extract.split(".")[0] + "."
    : "No summary available.";
  const content = extract
    ? extract.slice(summary.length).trim()
    : "No content available.";

  const url = `https://en.wikipedia.org/?curid=${pageid}`;

  return (
    <div className="w-full h-full flex flex-col bg-[#f8f9fa] overflow-hidden">
      <div className="p-4 border-b border-gray-300">
        <h2 className="text-2xl font-serif text-[#202122] truncate">{title}</h2>
        <p className="text-sm text-[#202122] italic mt-2">{summary}</p>
      </div>
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4">
          <p className="text-[#202122] leading-7">{content}</p>
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-gray-300 flex justify-end">
        <Button variant="link" asChild>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3366cc] hover:underline flex items-center"
          >
            Read more on Wikipedia
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
