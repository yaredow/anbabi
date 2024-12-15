import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useEffect, useRef, useState } from "react";
import { Rendition } from "epubjs";
import { ReactReader, ReactReaderStyle } from "react-reader";

import ToolBarModal from "@/components/tool-bar-modal";

import { useGetBook } from "../api/use-get-book";
import { useBookId } from "../hooks/use-book-id";
import { ITheme } from "../types";
import { useTheme } from "@/context/reader-theme-context";
import {
  darkReaderTheme,
  lightReaderTheme,
  sepiaReaderTheme,
} from "../constants";

type TocItem = {
  href: string;
  label: string;
};

type Selection = {
  text: string;
  cfiRange: string;
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
  const [selections, setSelections] = useState<Selection[]>([]);
  const [firstRenderDone, setFirstRenderDone] = useState(false);
  const [page, setPage] = useState("");
  const renditionRef = useRef<Rendition | undefined>(undefined);
  const [size, setSize] = useState(100);
  const tocRef = useRef<TocItem[] | null>(null);
  const { theme, updateTheme } = useTheme();

  let themeStyles;
  switch (theme) {
    case "dark":
      themeStyles = darkReaderTheme;
      break;
    case "sepia":
      themeStyles = sepiaReaderTheme;
      break;
    default:
      themeStyles = lightReaderTheme;
  }

  useEffect(() => {
    if (renditionRef.current) {
      const setRenderSelection = (cfiRange: string, contents: any) => {
        setSelections((prevSelections) => [
          ...prevSelections,
          {
            text: renditionRef.current?.getRange(cfiRange).toString() ?? "",
            cfiRange,
          },
        ]);

        renditionRef.current?.annotations.add(
          "highlight",
          cfiRange,
          {},
          undefined,
          "hl",
          { fill: "red", "fill-opacity": "0.5", "mix-blend-mode": "multiply" },
        );

        contents.window.getSelection().removeAllRanges();
      };

      renditionRef.current.on("selected", setRenderSelection);

      return () => {
        renditionRef.current?.off("selected", setRenderSelection);
      };
    }
  }, [setSelections, selections]);

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

  return (
    <>
      <VisuallyHidden>
        <ToolBarModal
          setFontSize={setSize}
          fontSize={size}
          renditionRef={renditionRef}
        />
      </VisuallyHidden>
      <div className="relative h-[95vh] top-0 w-full m-0 p-0 text-left">
        <ReactReader
          location={location}
          url={book?.bookUrl as string}
          epubInitOptions={{ openAs: "epub" }}
          locationChanged={locationChanged}
          getRendition={(rendition) => {
            renditionRef.current = rendition;
            renditionRef.current.themes.fontSize(`${size}%`);
            renditionRef.current.themes.default({
              "::selection": {
                background: "orange",
              },
            });
            updateTheme(rendition, theme);
          }}
          tocChanged={(toc) => (tocRef.current = toc)}
          readerStyles={{ ...ownStyle, ...themeStyles }}
          epubOptions={{
            allowPopups: true,
            allowScriptedContent: true,
          }}
        />
      </div>
      <div className="text-xs font-normal absolute bottom-3 right-4 left-4 text-center z-10">
        {page}
      </div>
    </>
  );
}
