"use client";

import React, { useEffect, useState } from "react";
import { ReactReader } from "react-reader";

type BookReaderProps = {
  fileUrl: string;
};

const EbookReader = ({ fileUrl }: BookReaderProps) => {
  const [location, setLocation] = useState<string | number>(0);

  const handleLocaltionChange = (newLocation: string | number) => {
    setLocation(newLocation);
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactReader
        url={fileUrl}
        location={location}
        locationChanged={handleLocaltionChange}
        epubInitOptions={{
          openAs: "epub",
        }}
      />
    </div>
  );
};

export default EbookReader;
