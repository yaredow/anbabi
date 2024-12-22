import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ReactReader, ReactReaderStyle } from "react-reader";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMedia } from "react-use";
import { Rendition } from "epubjs";

import ToolBarModal from "@/components/tool-bar-modal";

import { useGetBook } from "../api/use-get-book";
import { useBookId } from "../hooks/use-book-id";
import {
  darkReaderTheme,
  greenReaderTheme,
  lightReaderTheme,
  sepiaReaderTheme,
} from "../constants";
import { Loader2 } from "lucide-react";
import { useBookStore } from "../store/book-store";
import { TocItem } from "../types";
import { useAssistantMenuModal } from "@/features/assistants/hooks/use-assistant-menu-modal";
import AssistantMenuModal from "@/features/assistants/components/assistant-menu-modal";
import AssistantItemsModal from "@/features/assistants/components/assistant-menu-item-modal";

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
  const isDesktop = useMedia("(min-width: 1024px)", true);
  const bookId = useBookId();
  const { book } = useGetBook({ bookId });
  const [location, setLocation] = useState<string | number>(0);
  const [firstRenderDone, setFirstRenderDone] = useState(false);
  const [selectedCfiRange, setSelectedCfiRange] = useState("");
  const [page, setPage] = useState("");
  const renditionRef = useRef<Rendition | undefined>(undefined);
  const tocRef = useRef<TocItem[] | null>(null);
  const { open } = useAssistantMenuModal();
  const {
    theme,
    updateTheme,
    fontSize,
    fontFamily,
    selections,
    addSelection,
    clearSelections,
  } = useBookStore();

  console.log({ selections, cfiRange: selectedCfiRange });

  let themeStyles;

  switch (theme) {
    case "dark":
      themeStyles = darkReaderTheme;
      break;
    case "sepia":
      themeStyles = sepiaReaderTheme;
      break;
    case "greenish":
      themeStyles = greenReaderTheme;
      break;
    default:
      themeStyles = lightReaderTheme;
  }

  // Open the assisstant menu when a highlight get clicked
  const handleHighlightClick = (cfiRange: string) => {
    setSelectedCfiRange(cfiRange);
    const highlightedSelections = useBookStore.getState().selections;
    const matchingSelection = highlightedSelections.find(
      (selection) => selection.cfiRange === cfiRange,
    );

    if (matchingSelection) {
      open();
    }
  };

  useEffect(() => {
    if (renditionRef.current) {
      const handleTextSelection = (cfiRange: string, contents: any) => {
        const text = renditionRef?.current?.getRange(cfiRange).toString();

        if (text) {
          addSelection({ text, cfiRange });
          setSelectedCfiRange(cfiRange);

          // Open the assisstant menu when text selected
          open();

          // Add highlight annotation
          renditionRef?.current?.annotations.add(
            "highlight",
            cfiRange,
            {},
            () => handleHighlightClick(cfiRange),
            undefined,
            {
              fill: "#FFFFE0",
              "fill-opacity": "0.6",
              "mix-blend-mode": "multiply",
            },
          );

          // Clear the browser's selection
          contents.window.getSelection().removeAllRanges();
        }
      };

      // Attach the 'selected' event to the rendition
      renditionRef.current.on("selected", handleTextSelection);

      return () => {
        renditionRef.current?.off("selected", handleTextSelection);
      };
    }
  }, [addSelection, selections]);

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
        <ToolBarModal renditionRef={renditionRef} />
        <AssistantMenuModal
          renditionRef={renditionRef}
          selectedCfiRange={selectedCfiRange}
        />
        <AssistantItemsModal selectedCfiRange={selectedCfiRange} />
      </VisuallyHidden>

      <div
        className={`relative top-0 w-full m-0 p-0 text-left ${
          isDesktop ? "h-full" : "h-[95vh]"
        }`}
      >
        <ReactReader
          location={location}
          url={book?.bookUrl as string}
          epubInitOptions={{ openAs: "epub" }}
          locationChanged={locationChanged}
          loadingView={
            <div className="flex items-center justify-center h-full w-full">
              <Loader2 className="animate-spin size-6 text-gray-500" />
            </div>
          }
          getRendition={(rendition) => {
            renditionRef.current = rendition;
            renditionRef.current.themes.fontSize(`${fontSize}%`);
            renditionRef.current.themes.default({
              "::selection": {
                background: "#FFFF99",
              },
            });

            clearSelections();

            renditionRef.current.themes.register("custom", {
              p: {
                "font-family": fontFamily,
              },
            });

            renditionRef.current.themes.select("custom");

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
