import { useEffect, useRef, useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useGetBook } from "../api/use-get-book";
import { useBookId } from "../hooks/use-book-id";
import { ReactReader, ReactReaderStyle } from "react-reader";
import { Rendition } from "epubjs";
import { useToolBarModal } from "@/hooks/use-tool-bar-modal";
import ToolBarModal from "@/components/tool-bar-modal";

type TocItem = {
  href: string;
  label: string;
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

export default function BookReader() {
  const bookId = useBookId();
  const { book } = useGetBook({ bookId });
  const [location, setLocation] = useState<string | number>(0);
  const [firstRenderDone, setFirstRenderDone] = useState(false);
  const [page, setPage] = useState("");
  const renditionRef = useRef<Rendition | null>(null);
  const [size, setSize] = useState(100);
  const tocRef = useRef<TocItem[] | null>(null);
  const { setIsOpen, isOpen, open } = useToolBarModal();

  const changeSize = (newSize: number) => {
    setSize(newSize);
  };

  const locationChanged = (epubcifi: string) => {
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

  useEffect(() => {
    if (renditionRef.current) {
      renditionRef.current.themes.fontSize(`${size}`);
    }
  }, [size]);

  return (
    <>
      <VisuallyHidden>
        <ToolBarModal setFontSize={setSize} fontSize={size} />
      </VisuallyHidden>
      <div className="relative h-[93vh] w-full m-0 p-0 text-left">
        <ReactReader
          location={location}
          url={book?.bookUrl as string}
          epubInitOptions={{ openAs: "epub" }}
          locationChanged={locationChanged}
          getRendition={(rendition) => (renditionRef.current = rendition)}
          tocChanged={(toc) => (tocRef.current = toc)}
          readerStyles={{ ...ownStyle }}
          epubOptions={{
            allowPopups: true,
            allowScriptedContent: true,
          }}
        />
      </div>
      <div className="text-xs font-normal absolute bottom-4 right-4 left-4 text-center z-10">
        {page}
      </div>
    </>
  );
}
