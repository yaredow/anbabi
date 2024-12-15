import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRef, useState } from "react";
import { Rendition } from "epubjs";
import {
  ReactReader,
  ReactReaderStyle,
  type IReactReaderStyle,
} from "react-reader";

import ToolBarModal from "@/components/tool-bar-modal";

import { useGetBook } from "../api/use-get-book";
import { useBookId } from "../hooks/use-book-id";
import { ITheme } from "../types";

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
  const [theme, setTheme] = useState<ITheme>("light");
  const tocRef = useRef<TocItem[] | null>(null);

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

  function updateTheme(rendition: Rendition, theme: ITheme) {
    const themes = rendition.themes;
    switch (theme) {
      case "dark": {
        themes.override("color", "#fff");
        themes.override("background", "#000");
        break;
      }
      case "light": {
        themes.override("color", "#000");
        themes.override("background", "#fff");
        break;
      }
      case "sepia": {
        themes.override("color", "#5b4636");
        themes.override("background", "#f5deb3");
        break;
      }
      case "greenish": {
        themes.override("color", "#3e4e3f");
        themes.override("background", "#e4f7e7");
        break;
      }
    }
  }

  return (
    <>
      <VisuallyHidden>
        <ToolBarModal
          setFontSize={setSize}
          fontSize={size}
          currentTheme={theme}
          setTheme={setTheme}
          renditionRef={renditionRef}
          updateTheme={updateTheme}
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
            updateTheme(rendition, theme);
          }}
          tocChanged={(toc) => (tocRef.current = toc)}
          readerStyles={{
            ...ownStyle,
            ...(theme === "dark"
              ? darkReaderTheme
              : theme === "sepia"
                ? sepiaReaderTheme
                : theme === "greenish"
                  ? greenReaderTheme
                  : lightReaderTheme),
          }}
          epubOptions={{
            allowPopups: true,
            allowScriptedContent: true,
          }}
        />
      </div>
      <div className="text-xs font-normal absolute bottom-2 right-4 left-4 text-center z-10">
        {page}
      </div>
    </>
  );
}

const lightReaderTheme: IReactReaderStyle = {
  ...ReactReaderStyle,
  readerArea: {
    ...ReactReaderStyle.readerArea,
    transition: undefined,
  },
};

const darkReaderTheme: IReactReaderStyle = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    color: "white",
  },
  arrowHover: {
    ...ReactReaderStyle.arrowHover,
    color: "#ccc",
  },
  readerArea: {
    ...ReactReaderStyle.readerArea,
    backgroundColor: "#000",
    transition: undefined,
  },
  titleArea: {
    ...ReactReaderStyle.titleArea,
    color: "#ccc",
  },
  tocArea: {
    ...ReactReaderStyle.tocArea,
    background: "#111",
  },
  tocButtonExpanded: {
    ...ReactReaderStyle.tocButtonExpanded,
    background: "#222",
  },
  tocButtonBar: {
    ...ReactReaderStyle.tocButtonBar,
    background: "#fff",
  },
  tocButton: {
    ...ReactReaderStyle.tocButton,
    color: "white",
  },
};

const sepiaReaderTheme: IReactReaderStyle = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    color: "#5b4636", // Sepia tone for consistency with text
  },
  arrowHover: {
    ...ReactReaderStyle.arrowHover,
    color: "#4a3c28", // Slightly darker sepia tone for hover effect
  },
  readerArea: {
    ...ReactReaderStyle.readerArea,
    backgroundColor: "#f5deb3", // Sepia background color
    transition: undefined,
  },
  titleArea: {
    ...ReactReaderStyle.titleArea,
    color: "#5b4636", // Sepia color for text
  },
  tocArea: {
    ...ReactReaderStyle.tocArea,
    background: "#f5deb3", // Same sepia background for TOC to match the reader area
  },
  tocButtonExpanded: {
    ...ReactReaderStyle.tocButtonExpanded,
    background: "#e0c3a1", // Lighter sepia tone for expanded buttons
  },
  tocButtonBar: {
    ...ReactReaderStyle.tocButtonBar,
    background: "#5b4636", // Darker sepia for button bar for contrast
  },
  tocButton: {
    ...ReactReaderStyle.tocButton,
    color: "#f5deb3", // Light text color to contrast with dark background
  },
};

const greenReaderTheme: IReactReaderStyle = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    color: "#3e4e3f", // Matches the title text color for consistency
  },
  arrowHover: {
    ...ReactReaderStyle.arrowHover,
    color: "#2f3b30", // A darker greenish tone for hover feedback
  },
  readerArea: {
    ...ReactReaderStyle.readerArea,
    backgroundColor: "#e4f7e7", // The main greenish background
    transition: undefined,
  },
  titleArea: {
    ...ReactReaderStyle.titleArea,
    color: "#3e4e3f", // Compliments the background with a dark green
  },
  tocArea: {
    ...ReactReaderStyle.tocArea,
    background: "#d5efe0", // A lighter greenish tone for contrast
  },
  tocButtonExpanded: {
    ...ReactReaderStyle.tocButtonExpanded,
    background: "#cbe6d6", // Slightly darker than tocArea for hierarchy
  },
  tocButtonBar: {
    ...ReactReaderStyle.tocButtonBar,
    background: "#3e4e3f", // Matches arrow and title for consistency
  },
  tocButton: {
    ...ReactReaderStyle.tocButton,
    color: "#e4f7e7", // Contrast with the darker button background
  },
};
