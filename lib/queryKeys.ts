import { StatusType } from "@prisma/client";

export const bookKeys = {
  books: ["books"] as const,
  counts: ["counts"] as const,
  book: (id: string) => [`book-${id}`] as const,
  filter: (filter: { category: string; status: StatusType }) =>
    [
      "filteredBooks",
      { category: filter.category, status: filter.status },
    ] as const,
};

export const collectionKeys = {
  collections: ["collections"] as const,
  collection: (id: string) => [`collection-${id}`] as const,
};

export const assistatntKeys = {
  translation: (text: string, targetLang: string, sourceLang: string) =>
    ["translated-text", text, targetLang, sourceLang] as const,
  detetction: (text: string) => ["detected-lang", text] as const,
  defination: (word: string) => ["dictionary", word] as const,
  wiki: (selectedText: string) => ["wiki", selectedText] as const,
};
