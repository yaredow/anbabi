import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AnnoationColor } from "@/features/annotations/constants";
import { RenditionRef } from "@/features/books/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  // Convert ArrayBuffer to Uint8Array
  const uint8Array = new Uint8Array(buffer);

  // Create a binary string from the array
  let binaryString = "";
  for (let i = 0; i < uint8Array.byteLength; i++) {
    binaryString += String.fromCharCode(uint8Array[i]);
  }

  // Convert binary string to base64
  return btoa(binaryString);
}

export function updateAnnotationColor(
  cfiRange: string,
  newColor: AnnoationColor,
  renditionRef: RenditionRef,
  onClickCallback?: (cfiRange: string) => void,
) {
  if (renditionRef.current) {
    // Add a new annotation with the updated color
    renditionRef.current.annotations.add(
      "highlight",
      cfiRange,
      {},
      () => {
        if (onClickCallback) {
          onClickCallback(cfiRange);
        }
      },
      undefined,
      {
        fill: newColor.fill,
        "fill-opacity": newColor.opacity,
        "mix-blend-mode": "multiply",
      },
    );
  }
}
