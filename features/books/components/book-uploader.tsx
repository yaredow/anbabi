"use client";

import { Upload, X, FileText, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

import { arrayBufferToBase64 } from "@/lib/utils";
import { parseEpub } from "@/lib/epub-parser";

import { Button } from "@/components/ui/button";

import { useUploadBook } from "../api/use-upload-book";
import { BookType } from "../types";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

type EpubUploaderProps = {
  onCancel: () => void;
};

export default function EpubUploader({ onCancel }: EpubUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [parsedFiles, setParsedFiles] = useState<BookType[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const { upload, status } = useUploadBook();
  const queryClinet = useQueryClient();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File) => {
    if (!file.type.includes("epub")) {
      return "Only EPUB files are allowed";
    }
    if (file.size > 5 * 1024 * 1024) {
      return "File size must be less than 5MB";
    }
    return null;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      handleFiles(filesArray);
    }
  };

  const handleFiles = async (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);

    const updatedParsedFiles = await Promise.all(
      newFiles.map(async (file) => {
        const error = validateFile(file);
        if (error) {
          return { fileName: file.name, error };
        }

        try {
          const parsedData = await parseEpub(file);
          return { ...parsedData, fileName: file.name, progress: 0 };
        } catch (error) {
          console.error("Error parsing EPUB:", error);
          return { fileName: file.name, error: "Failed to parse epub" };
        }
      }),
    );

    setParsedFiles((prev) => [...prev, ...updatedParsedFiles]);
  };

  const handleUpload = async () => {
    for (const parsedFile of parsedFiles) {
      if (parsedFile) {
        const base64Data = arrayBufferToBase64(parsedFile.arrayBuffer);
        upload(
          {
            json: {
              ...parsedFile,
              base64Data,
              language: parsedFile.language || "en",
            },
          },
          {
            onSuccess: () => {
              queryClinet.invalidateQueries({ queryKey: ["books"] });
              toast({
                description: "Book uploaded successfully",
              });
              onCancel();
            },
          },
        );
      }
    }
  };

  const removeFile = (fileName: string) => {
    setParsedFiles((prevFiles) =>
      prevFiles.filter((file) => file.fileName !== fileName),
    );
  };

  return (
    <div className="w-full max-w-3xl p-6 mx-auto">
      <div className="grid gap-8 md:grid-cols-2">
        <div
          className={`relative rounded-lg border-dashed p-8 text-center ${
            dragActive ? "border-primary bg-primary/5" : "border-blue-400"
          }`}
          style={{
            borderWidth: "2px",
            borderStyle: "dashed",
            borderRadius: "8px",
            borderColor: dragActive ? "var(--primary)" : "#60a5fa",
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            className="hidden"
            type="file"
            multiple
            accept=".epub"
            onChange={handleChange}
          />
          <div className="flex flex-col items-center gap-4">
            <Upload className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">
              Drag and Drop files to upload
            </h3>
            <p className="text-sm text-muted-foreground">or</p>
            <Button
              variant="secondary"
              onClick={() => inputRef.current?.click()}
            >
              Browse
            </Button>
            <p className="text-sm text-muted-foreground">
              Supported files: EPUB (max 5MB)
            </p>
          </div>
        </div>

        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
          <h3 className="text-lg font-semibold">Uploaded files</h3>
          {parsedFiles.map((file) => (
            <div
              key={file.fileName}
              className="flex items-center gap-4 rounded-lg border p-4"
            >
              <FileText
                className={`h-8 w-8 flex-shrink-0 ${
                  file.error ? "text-red-500" : "text-blue-500"
                }`}
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{file.fileName}</p>
                  <button
                    onClick={() => removeFile(file.fileName)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {file.error && (
                  <p className="text-sm text-red-500">{file.error}</p>
                )}
              </div>
            </div>
          ))}
          {files.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No files uploaded yet
            </p>
          )}
        </div>
      </div>
      <div className="mt-4 flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={status === "pending"}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          disabled={status === "pending" || files.length === 0}
        >
          Upload
        </Button>
      </div>
    </div>
  );
}
