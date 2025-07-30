import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ReactReader, ReactReaderStyle } from "react-reader";
import { Suspense, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useMedia } from "react-use";

import { updateAnnotationColor } from "@/lib/utils";

import { useAssistantMenuModal } from "@/features/assistants/hooks/use-assistant-menu-modal";
import AssistantItemsModal from "@/features/assistants/components/assistant-menu-item-modal";
import AssistantMenuModal from "@/features/assistants/components/assistant-menu-modal";
import { useAnnotationStore } from "@/features/annotations/store/annotations-store";

import ToolBarModal from "@/components/tool-bar-modal";

import { useBookStore } from "../store/book-store";
import { useGetBook } from "../api/use-get-book";
import { useBookId } from "../hooks/use-book-id";
import { TocItem } from "../types";
import {
  darkReaderTheme,
  greenReaderTheme,
  lightReaderTheme,
  sepiaReaderTheme,
} from "../constants";

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
  const tocRef = useRef<TocItem[] | null>(null);
  const { open } = useAssistantMenuModal();
  const { renditionRef, theme, updateTheme, fontSize, fontFamily } =
    useBookStore();
  const {
    selectedColor,
    selections,
    clearSelections,
    addSelection,
    setSelectedColor,
  } = useAnnotationStore();

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
    const highlightedSelections = useAnnotationStore.getState().selections;
    const matchingSelection = highlightedSelections.find(
      (selection) => selection.cfiRange === cfiRange,
    );

    if (matchingSelection) {
      setSelectedColor(matchingSelection.color);
      open();
    }
  };

  useEffect(() => {
    if (renditionRef.current) {
      const handleTextSelection = (cfiRange: string, contents: any) => {
        const text = renditionRef?.current?.getRange(cfiRange).toString();

        if (text) {
          // prevent re-highlighting and layering of colors
          const existingSelection = selections.find(
            (sel) => sel.cfiRange === cfiRange,
          );

          if (
            existingSelection &&
            existingSelection.color.fill === selectedColor.fill
          ) {
            return;
          }

          // add a new selection
          const newSelection = { text, cfiRange, color: selectedColor };
          addSelection(newSelection);
          setSelectedCfiRange(cfiRange);

          // Open the assistant menu when text is selected
          open();

          // Add highlight annotation with updated color
          updateAnnotationColor(
            cfiRange,
            selectedColor,
            renditionRef,
            handleHighlightClick,
          );

          // Update the annotation color in the store
          useAnnotationStore
            .getState()
            .updateAnnotationColor(cfiRange, selectedColor);

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
  }, [addSelection, selections, selectedColor]);

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
        `Page ${displayed.page} of ${displayed.total} in chapter ${chapter ? chapter.label : "n/a"
        }`,
      );
    }
  };

  return (
    <>
      <VisuallyHidden>
        <Suspense fallback={<div>Loading...</div>}>
          <ToolBarModal renditionRef={renditionRef} />
          <AssistantMenuModal
            selectedCfiRange={selectedCfiRange}
            handleHighlightClick={handleHighlightClick}
          />
          <AssistantItemsModal selectedCfiRange={selectedCfiRange} />
        </Suspense>
      </VisuallyHidden>

      <div
        className={`relative my-0 mx-auto top-0 w-full m-0 p-0 text-left ${isDesktop ? "h-full" : "h-[95vh]"
          }`}
      >
        <ReactReader
          location={location}
          url={book?.bookUrl as string}
          epubInitOptions={{ openAs: "epub" }}
          title={book?.title}
          showToc
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
                background: "#CCE4F7",
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
          readerStyles={themeStyles}
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
