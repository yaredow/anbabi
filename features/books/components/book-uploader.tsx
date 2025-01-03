"use client";

import { Upload, X, FileText, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

import { arrayBufferToBase64 } from "@/lib/utils";
import { parseEpub } from "@/lib/epub-parser";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { useUploadBook } from "../api/use-upload-book";
import { BookType } from "../types";

type EpubUploaderProps = {
  onCancel: () => void;
};

export default function EpubUploader({ onCancel }: EpubUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [parsedFiles, setParsedFiles] = useState<BookType[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, status, error: uploadingError } = useUploadBook();

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
        if (!error) {
          try {
            const parsedData = await parseEpub(file);
            return parsedData;
          } catch (error) {
            console.error("Error parsing EPUB:", error);
            return null;
          }
        } else {
          return null;
        }
      }),
    );

    setParsedFiles((prev) => [
      ...prev,
      ...updatedParsedFiles.filter((data) => data !== null),
    ]);
  };

  const handleUpload = async () => {
    for (const parsedFile of parsedFiles) {
      if (parsedFile) {
        const base64Data = arrayBufferToBase64(parsedFile.arrayBuffer);
        try {
          upload({
            json: {
              json: {
                ...parsedFile,
                base64Data,
                language: (parsedFile.language && parsedFile.language) ?? "en",
              },
            },
            onProgress: (progress: number) => {
              setParsedFiles((prev) =>
                prev.map((f) =>
                  f. === parsedFile.file.name
                    ? { ...f, progress } // Update progress for the specific file
                    : f,
                ),
              );
            },
          });
        } catch (error) {
          console.error("Error during upload:", error);
          setParsedFiles((prev) =>
            prev.map((f) =>
              f.file === file
                ? { ...f, error: "Failed to upload." } // Set error if upload fails
                : f,
            ),
          );
        }
      }
    }
  };

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((file) => file.name !== name));
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

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Uploaded files</h3>
          {files.map((file) => (
            <div
              key={file.name}
              className="flex items-center gap-4 rounded-lg border p-4"
            >
              <FileText className="h-8 w-8 flex-shrink-0 text-blue-500" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{file.name}</p>
                  <button
                    onClick={() => removeFile(file.name)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {status === "error" ? (
                  <p className="text-sm text-destructive">
                    {uploadingError?.message}
                  </p>
                ) : (
                  <Progress value={file.progress} className="h-2" />
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
