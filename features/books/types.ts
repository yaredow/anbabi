import { RefObject } from "react";
import { Rendition } from "epubjs";
import { AnnoationColor } from "../annotations/constants";

export type Book = {
  id: string;
  title: string;
  author: string;
  description?: string; // A short summary or description of the book
  publisher?: string; // Publisher's name
  publishedDate?: string; // Publication date
  language?: string; // Language of the book
  categories?: string[]; // Array of categories or genres
  coverImageUrl?: string; // URL of the book's cover image
  fileUrl: string; // URL to the uploaded EPUB file
  createdAt: Date; // Timestamp for when the book was added
  updatedAt: Date; // Timestamp for when the book was last updated
};

export type BookType = {
  title: string;
  author: string;
  language?: string;
  description?: string;
  publisher?: string;
  publishedDate?: string;
  categories?: string[];
  isbn?: string;
  arrayBuffer: ArrayBuffer;
  error?: number;
  fileName?: string;
};

export type BooksCount = {
  categoryCount: Record<string, number>;
  libraryCount: Record<string, number>;
  totalBooks: number;
};

export interface UploadState {
  progress: number;
  status: "idle" | "parsing" | "uploading" | "complete" | "error";
  error?: string;
}

export type RenditionRef = RefObject<Rendition | undefined>;

export type ITheme = "light" | "dark" | "sepia" | "greenish" | "system";

export type TocItem = {
  href: string;
  label: string;
};

export type Selection = {
  text: string;
  cfiRange: string;
  color: AnnoationColor;
};
