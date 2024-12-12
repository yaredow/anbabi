import { useState } from "react";
import { useGetBook } from "../api/use-get-book";
import { useBookId } from "../hooks/use-book-id";
import { ReactReader } from "react-reader";

type BookReaderProps = {
  onCancel: () => void;
};

export default function BookReader({ onCancel }: BookReaderProps) {
  const [location, setLocation] = useState<string | number>(0);
  const bookId = useBookId();
  const { book } = useGetBook({ bookId });

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactReader
        location={location}
        url={book?.bookUrl as string}
        epubInitOptions={{ openAs: "epub" }}
        locationChanged={(epubcfi: string) => setLocation(epubcfi)}
      />
    </div>
  );
}
