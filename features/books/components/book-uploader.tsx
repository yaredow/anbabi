"use client";

import { AlertCircle, CheckCircle2, Upload } from "lucide-react";
import { useState, useRef } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { parseEpub } from "@/lib/epub-parser";
import { Input } from "@/components/ui/input";

import { useUploadBook } from "../api/use-upload-book";
import { BookType } from "../types";
import { arrayBufferToBase64 } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

type EpubUploaderProps = {
  onCancel: () => void;
};

export default function BookUploader({ onCancel }: EpubUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [epubInfo, setEpubInfo] = useState<BookType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { upload, status } = useUploadBook();
  const queryClient = useQueryClient();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];
    console.log("Selected file:", selectedFile);

    if (selectedFile?.type === "application/epub+zip") {
      setFile(selectedFile);
      setError(null);

      try {
        const bookData = await parseEpub(selectedFile);
        console.log("Parsed EPUB data:", bookData);
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
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="text-center text-lg font-bold">
          Upload an EPUB Book
        </CardTitle>
        <p className="text-sm text-muted-foreground text-center">
          Select and upload your favorite EPUB file to get started.
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Input
            type="file"
            accept=".epub"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="secondary"
            className="w-40"
          >
            Select EPUB
          </Button>
          {file && (
            <span className="text-sm text-gray-500 truncate" title={file.name}>
              {file.name}
            </span>
          )}
        </div>

        {epubInfo && (
          <div className="mt-4 space-y-2 border-t pt-4">
            <h3 className="font-medium text-lg">EPUB Information:</h3>
            <p>
              <strong>Title:</strong> {epubInfo.title}
            </p>
            <p>
              <strong>Author:</strong> {epubInfo.author}
            </p>
          </div>
        )}

        {status === "pending" && (
          <div className="mt-4">
            <p className="text-sm text-center text-gray-500 mt-1">
              Uploading...
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center gap-2 text-red-500">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {status === "success" && (
          <div className="mt-4 flex items-center gap-2 text-green-500">
            <CheckCircle2 size={16} />
            <span>Upload complete!</span>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <Button onClick={onCancel} variant="outline" className="w-28">
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={status === "pending"}
            className="w-28"
          >
            {status === "pending" ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
