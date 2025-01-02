"use client";

import * as React from "react";
import { Upload, X, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface UploadedFile {
  id: string;
  name: string;
  progress: number;
  error?: string;
}

export default function EpubUploader() {
  const [dragActive, setDragActive] = React.useState(false);
  const [files, setFiles] = React.useState<UploadedFile[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

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

  const handleFiles = (newFiles: File[]) => {
    newFiles.forEach((file) => {
      const error = validateFile(file);
      const fileObj: UploadedFile = {
        id: Math.random().toString(36).slice(2),
        name: file.name,
        progress: error ? 100 : 0,
        error,
      };

      setFiles((prev) => [...prev, fileObj]);

      if (!error) {
        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id
                ? { ...f, progress: Math.min(progress, 100) }
                : f,
            ),
          );
          if (progress >= 100) clearInterval(interval);
        }, 500);
      }
    });
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
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
              key={file.id}
              className="flex items-center gap-4 rounded-lg border p-4"
            >
              <FileText className="h-8 w-8 flex-shrink-0 text-blue-500" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{file.name}</p>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {file.error ? (
                  <p className="text-sm text-destructive">{file.error}</p>
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
    </div>
  );
}
