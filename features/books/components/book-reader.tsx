import { useRef, useState } from "react";
import { useGetBook } from "../api/use-get-book";
import { useBookId } from "../hooks/use-book-id";
import { ReactReader, ReactReaderStyle } from "react-reader";

type BookReaderProps = {
  onCancel: () => void;
};

const ownStyle = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    fontSize: "30px",
  },
  container: {
    ...ReactReaderStyle.container,
    padding: "0px",
    margin: "0px",
    maxWidth: "100%",
  },
};

export default function BookReader({ onCancel }: BookReaderProps) {
  const bookId = useBookId();
  const { book } = useGetBook({ bookId });

  const [location, setLocation] = useState<string | number>(0);
  const [firstRenderDone, setFirstRenderDone] = useState(false);
  const [page, setPage] = useState("");
  const renditionRef = useRef(null);
  const tocRef = useRef(null);

  const locationChanged = (epubcifi) => {
    if (!firstRenderDone) {
      setLocation(localStorage.getItem("book-progress") || "");
      setFirstRenderDone(true);
      return;
    }

    localStorage.setItem("book-progress", epubcifi);

    if (renditionRef.current && tocRef.current) {
      const { displayed, href } = renditionRef.current.location.start;
      const chapter = tocRef.current.find((item) => item.href === href);
      setPage(
        `Page ${displayed.page} of ${displayed.total} in chapter ${
          chapter ? chapter.label : "n/a"
        }`,
      );
    }
  };

  return (
    <>
      <div
        style={{
          position: "relative",
          height: "100vh",
          width: "100%",
          margin: 0,
          padding: 0,
        }}
      >
        <ReactReader
          location={location}
          url={book?.bookUrl as string}
          epubInitOptions={{ openAs: "epub" }}
          locationChanged={locationChanged}
          getRendition={(rendition) => (renditionRef.current = rendition)}
          tocChanged={(toc) => (tocRef.current = toc)}
          readerStyles={{ ...ownStyle }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "1rem",
          right: "1rem",
          left: "1rem",
          textAlign: "center",
          zIndex: 1,
        }}
        className="text-sm font-normal"
      >
        {page}
      </div>
    </>
  );
}
