"use client";

import EbookReader from "@/components/ebook-reader";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

export default function Home() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.type === "application/epub+zip") {
      const fileUrl = URL.createObjectURL(file);
      setFileUrl(fileUrl);
    } else {
      toast({
        description: "Please upload a valid epub",
      });
    }
  };

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
    </div>
  );
}
