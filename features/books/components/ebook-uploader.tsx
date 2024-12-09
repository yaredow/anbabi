"use client";

import { AlertCircle, CheckCircle2, Upload } from "lucide-react";
import { useState, useRef } from "react";

import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

import { EpubInfo, UploadState } from "../types";
import { parseEpub } from "@/lib/epub-parser";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type EpubUploaderProps = {
  onCancel: () => void;
};

export default function EpubUploader({ onCancel }: EpubUploaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [epubInfo, setEpubInfo] = useState<EpubInfo | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>({
    progress: 0,
    status: "idle",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/epub+zip") {
      setFile(selectedFile);
      setUploadState({ progress: 0, status: "parsing" });
      try {
        const info = await parseEpub(selectedFile);
        setEpubInfo(info);
        setUploadState({ progress: 0, status: "idle" });
      } catch (error) {
        setUploadState({
          progress: 0,
          status: "error",
          error: "Failed to parse EPUB file",
        });
      }
    } else {
      setUploadState({
        progress: 0,
        status: "error",
        error: "Please select a valid EPUB file",
      });
    }
  };

  const simulateUpload = () => {
    setUploadState({ progress: 0, status: "uploading" });
    const interval = setInterval(() => {
      setUploadState((prev) => {
        if (prev.progress >= 100) {
          clearInterval(interval);
          return { progress: 100, status: "complete" };
        }
        return { progress: prev.progress + 10, status: "uploading" };
      });
    }, 500);
  };

  const handleUpload = () => {
    if (file) {
      simulateUpload();
    }
  };

  const resetUpload = () => {
    setFile(null);
    setEpubInfo(null);
    setUploadState({ progress: 0, status: "idle" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload EPUB</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <Input
            type="file"
            accept=".epub"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadState.status === "uploading"}
          >
            Select EPUB
          </Button>

          {file && (
            <span className="text-sm text-gray-500 truncate">{file.name}</span>
          )}
        </div>
        {epubInfo && (
          <div className="space-y-2">
            <h3 className="font-semibold">EPUB Information:</h3>
            <p>Title: {epubInfo.title}</p>
            <p>Author: {epubInfo.author}</p>
          </div>
        )}
        {uploadState.status === "uploading" && (
          <Progress value={uploadState.progress} className="w-full" />
        )}
        {uploadState.status === "error" && (
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle size={16} />
            <span>{uploadState.error}</span>
          </div>
        )}
        {uploadState.status === "complete" && (
          <div className="flex items-center gap-2 text-green-500">
            <CheckCircle2 size={16} />
            <span>Upload complete!</span>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button onClick={resetUpload} variant="outline">
            Reset
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || uploadState.status === "uploading"}
          >
            {uploadState.status === "uploading" ? (
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
