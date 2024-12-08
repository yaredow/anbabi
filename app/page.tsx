"use client";

import EbookReader from "@/components/ebook-reader";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export default function Home() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.type === "application/epub+zip") {
      const fileUrl = URL.createObjectURL(file);

      localStorage.setItem("bookUrl", fileUrl);

      setFileUrl(fileUrl);
    } else {
      toast({
        description: "Please upload a valid epub",
      });
    }
  };

  const handleClearBook = () => {
    localStorage.removeItem("bookUrl");
    setFileUrl(null);
  };

  useEffect(() => {
    const savedBook = localStorage.getItem("bookUrl");

    if (savedBook) {
      setFileUrl(savedBook);
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {!fileUrl ? (
        <div className="flex flex-col gap-y-2">
          <h1>Upload file</h1>
          <input type="file" accept=".epub" onChange={handleFileUpload} />
        </div>
      ) : (
        <EbookReader fileUrl={fileUrl} />
      )}
      <button onClick={handleClearBook} style={{ margin: "1rem" }}>
        Clear Book
      </button>
    </div>
  );
}
