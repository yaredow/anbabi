import * as EPUBJS from "epubjs";

export async function parseEpub(file: File): Promise<{
  title: string;
  author: string;
  description?: string;
  publisher?: string;
  publishedDate?: string;
  language?: string;
  categories?: string[];
  coverImageUrl?: string;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const book = EPUBJS.default(arrayBuffer);

        const metadata = await book.packaging.metadata;

        let coverImageUrl: string | undefined;

        try {
          const coverBlob = await book.archive
            .file(book.packaging.coverPath)
            ?.async("blob");
          if (coverBlob) {
            coverImageUrl = URL.createObjectURL(coverBlob);
          }
        } catch (error) {
          console.warn("Failed to extract cover image:", error);
        }

        resolve({
          title: metadata.title || "Unknown Title",
          author: metadata.creator || "Unknown Author",
          description: metadata.description || "No description available.",
          publisher: metadata.publisher || "Unknown Publisher",
          publishedDate: metadata.pubdate || "Unknown Date",
          language: metadata.language || "Unknown Language",
          coverImageUrl,
        });
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
