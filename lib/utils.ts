import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcrypt";

import { AnnoationColor } from "@/features/annotations/constants";
import { RenditionRef } from "@/features/books/types";
import { StatusType } from "@/features/books/schemas";

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

export const generatePastelColor = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 80%)`;
};

export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const formatStatus = (status: string) => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const normalizeCategory = (category: string): string => {
  const categoryMapping: { [key: string]: string } = {
    "biography & autobiography": "biography",
    autobiography: "biography",
  };

  return categoryMapping[category.toLowerCase()] || category;
};

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export async function verifyPassword(data: {
  password: string;
  hash: string;
}): Promise<boolean> {
  const { password, hash } = data;
  return await bcrypt.compare(password, hash);
}

export const statusMapping: Record<string, StatusType> = {
  favorites: StatusType.FAVORITE,
  to_read: StatusType.TO_READ,
  currently_reading: StatusType.CURRENTLY_READING,
  completed: StatusType.COMPLETED,
};
