"use client";

import {
  AlertCircle,
  Check,
  CheckCircle2,
  Loader,
  Upload,
  X,
} from "lucide-react";
import { useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import { parseEpub } from "@/lib/epub-parser";

import { useUploadBook } from "../api/use-upload-book";
import { BookType } from "../types";
import { arrayBufferToBase64 } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";

type EpubUploaderProps = {
  onCancel: () => void;
};

export default function BookUploader({ onCancel }: EpubUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [epubInfo, setEpubInfo] = useState<BookType | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { upload, status } = useUploadBook();
  const queryClient = useQueryClient();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile?.type === "application/epub+zip") {
      setFile(selectedFile);
      setError(null);

      try {
        const bookData = await parseEpub(selectedFile);
        setEpubInfo(bookData);
      } catch (err) {
        console.error("Error parsing EPUB:", err);
        setError("Failed to parse EPUB file.");
      }
    } else {
      setError("Please select a valid EPUB file.");
    }
  };

  const handleUpload = () => {
    if (!epubInfo) {
      setError("Missing file or metadata to upload.");
      return;
    }

    upload(
      {
        json: {
          ...epubInfo,
          language: epubInfo.language || "Unknown language",
          base64Data: arrayBufferToBase64(epubInfo.arrayBuffer),
        },
      },
      {
        onSuccess: () => {
          toast({
            description: "Book uploaded successfully",
          });
          queryClient.invalidateQueries({ queryKey: ["books"] });
          onCancel();
        },
      },
    );
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-4">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="epub-upload"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">EPUB files only (max 5MB)</p>
          </div>
          <input
            id="epub-upload"
            type="file"
            className="hidden"
            accept=".epub"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {epubInfo && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-2">Book Details</h3>
          <p>
            <span className="font-medium">Title:</span> {epubInfo.title}
          </p>
          <p>
            <span className="font-medium">Author:</span> {epubInfo.author}
          </p>
        </div>
      )}

      {epubInfo && (
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button disabled={status === "pending"} onClick={handleUpload}>
            <Check className="w-4 h-4 mr-2" />
            {status === "pending" ? (
              <div className="flex gap-2">
                <Loader className="size-2 animate-spin" />
                <span>Uploading...</span>
              </div>
            ) : (
              "Upload"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
