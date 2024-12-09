"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function UploadButton() {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    setIsUploading(true);
    // Simulating upload process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsUploading(false);
    // Here you would typically handle the actual file upload and processing
    alert("Book uploaded successfully!");
  };

  return (
    <Button onClick={handleUpload} disabled={isUploading}>
      <Upload className="mr-2 h-4 w-4" />
      {isUploading ? "Uploading..." : "Upload Book"}
    </Button>
  );
}
