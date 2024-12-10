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
  pageCount?: number;
}> {
  console.log({ file });
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const book = EPUBJS.default(arrayBuffer);

        const metadata = book.packaging.metadata;

        const isbn =
          metadata.identifier && validateISBN(metadata.identifier)
            ? metadata.identifier
            : undefined;
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
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function validateISBN(isbn: string): boolean {
  const isbnRegex = /^(97(8|9))?\d{9}(\d|X)$/;
  return isbnRegex.test(isbn);
}
