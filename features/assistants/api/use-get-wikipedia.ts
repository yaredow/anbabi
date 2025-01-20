import { useQuery } from "@tanstack/react-query";
import { WikipediaApiResponse } from "../types";
import { assistatntKeys } from "@/lib/queryKeys";

type UseGetWikipedia = {
  selectedText: string;
};

export const useGetWikipedia = ({ selectedText }: UseGetWikipedia) => {
  const {
    data: wiki,
    isPending,
    error,
  } = useQuery<WikipediaApiResponse, Error>({
    queryKey: assistatntKeys.wiki(selectedText),
    queryFn: async () => {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=${selectedText}&exintro=true&explaintext=true&origin=*`,
      );

      if (!response.ok) {
        throw new Error("Something happened while getting the defination");
      }

      const data = await response.json();
      const pages = data.query.pages;
      const page = pages[Object.keys(pages)[0]];

      if (page) {
        return {
          query: {
            pages: {
              [pages.pageid]: {
                pageid: page.pageid,
                ns: page.ns,
                title: page.title,
                extract: page.extract,
                contentmodel: page.contentmodel,
                lastrevid: page.lastrevid,
              },
            },
          },
        };
      }
      throw new Error("No Wikipedia page found for the selected text");
    },
    enabled: !!selectedText,
  });
  return { wiki, isPending, error };
};
