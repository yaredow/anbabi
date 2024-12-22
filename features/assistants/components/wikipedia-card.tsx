import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetWikipedia } from "../api/use-get-wikipedia";
import { ExternalLink, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WikipediaCardProps {
  selectedText: string;
  onClose: () => void;
}

export default function WikipediaCard({ selectedText }: WikipediaCardProps) {
  const { wiki, isPending, error } = useGetWikipedia({ selectedText });
  console.log({ wiki });

  if (isPending) {
    return (
      <Loader2 className="flex mx-auto h-full items-center justify-center animate-spin" />
    );
  }

  if (!wiki || error) {
    return (
      <Card className="w-full max-w-3xl mx-auto bg-[#f8f9fa] border-gray-300">
        <CardHeader className="border-b border-gray-300">
          <CardTitle className="text-3xl font-serif text-[#202122]">
            No Wikipedia page found
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const page = wiki.query.pages[Object.keys(wiki.query.pages)[0]];

  if (!page) {
    return (
      <Card className="w-full max-w-3xl mx-auto bg-[#f8f9fa] border-gray-300 p-2">
        <CardHeader className="border-b border-gray-300">
          <CardTitle className="text-3xl font-serif text-[#202122]">
            No Wikipedia page found
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const { title, extract } = page;
  const summary = extract ? extract.split(".")[0] : "No summary available";
  const content = extract
    ? extract.slice(summary.length)
    : "No content available";

  const url = `https://en.wikipedia.org/?curid=${page.pageid}`;

  return (
    <Card className="w-full max-w-3xl rounded-none border-none h-full mx-auto bg-slate-50 overflow-y-auto">
      <CardHeader className="border-b">
        <CardTitle className="text-3xl font-serif text-[#202122]">
          {title}
        </CardTitle>
        <p className="text-sm text-[#202122] italic">{summary}</p>
      </CardHeader>
      <CardContent className="p-6">
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            <p className="text-[#202122] leading-7">{content}</p>
          </div>
        </ScrollArea>
        <div className="mt-6 flex justify-end">
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
      </CardContent>
    </Card>
  );
}
