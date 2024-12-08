"use client";

import React, { useEffect, useRef } from "react";
import ePub from "epubjs";

type BookReaderProps = {
  fileUrl: string;
};

const EbookReader = ({ fileUrl }: BookReaderProps) => {
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewerRef.current && fileUrl) {
      const book = ePub(fileUrl);
      const rendition = book.renderTo(viewerRef.current, {
        width: "100%",
        height: "100%",
      });

      rendition.display();
    }
  }, [fileUrl]);

  return <div ref={viewerRef} style={{ width: "100%", height: "100vh" }} />;
};

export default EbookReader;
