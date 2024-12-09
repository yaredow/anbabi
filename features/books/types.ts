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

export interface UploadState {
  progress: number;
  status: "idle" | "parsing" | "uploading" | "complete" | "error";
  error?: string;
}
