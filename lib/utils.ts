import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
