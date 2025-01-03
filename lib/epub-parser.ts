import * as EPUBJS from "epubjs";

export async function parseEpub(file: File): Promise<{
  arrayBuffer: ArrayBuffer;
  title: string;
  author: string;
  description?: string;
  language?: string;
  publicationYear?: number;
  isbn?: string;
  publisher?: string;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        if (!arrayBuffer) {
          reject(new Error("Failed to load ArrayBuffer from file"));
          return;
        }

        const book = new EPUBJS.Book(arrayBuffer);
        await book.ready;

        if (!book.packaging) {
          throw new Error("EPUB packaging data is missing.");
        }

        const metadata = book.packaging.metadata || {};
        console.log({ metadata });
        const isbn = metadata.identifier ? metadata.identifier : undefined;

        const publicationYear = metadata.pubdate
          ? parseInt(metadata.pubdate.split("-")[0], 10)
          : undefined;

        resolve({
          arrayBuffer,
          title: metadata.title || "Unknown Title",
          author: metadata.creator || "Unknown Author",
          description: metadata.description || undefined,
          language: metadata.language || "Unknown Language",
          publicationYear,
          isbn,
          publisher: metadata.publisher || undefined,
        });
      } catch (error) {
        console.error("Error parsing EPUB:", error);
        reject(new Error("Failed to parse EPUB file."));
      }
    };

    reader.onerror = (e) => {
      console.error("FileReader error:", e);
      reject(new Error("Failed to read file as ArrayBuffer"));
    };

    reader.readAsArrayBuffer(file);
  });
}
