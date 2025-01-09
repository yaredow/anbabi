import { IReactReaderStyle, ReactReaderStyle } from "react-reader";
import { StatusType } from "./schemas";

export const BookCategories = [
  { name: "All" },
  { name: "Fiction" },
  { name: "Non-Fiction" },
  { name: "Science-fiction" },
  { name: "Mystery" },
  { name: "Biography" },
];

export const Libraries = [
  { name: "Favorites", status: "FAVORITE" },
  { name: "To Read", status: "TO_READ" },
  { name: "Currently Reading", status: "CURRENTLY_READING" },
  { name: "Completed", status: "COMPLETED" },
];

export const themes = [
  { name: "light", backgroundColor: "#ffffff", textColor: "#000000" },
  { name: "dark", backgroundColor: "#000000", textColor: "#ffffff" },
  { name: "sepia", backgroundColor: "#f5deb3", textColor: "#5b4636" },
  { name: "greenish", backgroundColor: "#e4f7e7", textColor: "#3e4e3f" },
];

export const fontFamilies = [
  { name: "Helvetica" },
  { name: "Georgia" },
  { name: "Arial" },
  { name: "Courier New" },
  { name: "Verdana" },
  { name: "Comic Sans" },
];

export const statuses: StatusType[] = [
  StatusType.FAVORITE,
  StatusType.TO_READ,
  StatusType.CURRENTLY_READING,
  StatusType.COMPLETED,
];

export const categoryMapping: Record<string, string[]> = {
  biography: ["biography", "biographies", "autobiography", "autobiographies"],
  history: ["history", "historical"],
  science: ["science", "sciences"],
  // Add more mappings as needed
};

export const lightReaderTheme: IReactReaderStyle = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    fontSize: "30px",
  },
  readerArea: {
    ...ReactReaderStyle.readerArea,
    transition: undefined,
    background: "#fff",
    color: "#333333",
  },
};

export const darkReaderTheme: IReactReaderStyle = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    color: "white",
    fontSize: "30px",
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

export const sepiaReaderTheme: IReactReaderStyle = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    color: "#5b4636",
    fontSize: "30px",
  },
  arrowHover: {
    ...ReactReaderStyle.arrowHover,
    color: "#4a3c28",
  },
  readerArea: {
    ...ReactReaderStyle.readerArea,
    backgroundColor: "#f5deb3", // Sepia background color
    transition: undefined,
  },
  titleArea: {
    ...ReactReaderStyle.titleArea,
    color: "#5b4636",
  },
  tocArea: {
    ...ReactReaderStyle.tocArea,
    background: "#f5deb3",
  },
  tocButtonExpanded: {
    ...ReactReaderStyle.tocButtonExpanded,
    background: "#e0c3a1",
  },
  tocButtonBar: {
    ...ReactReaderStyle.tocButtonBar,
    background: "#5b4636",
  },
  tocButton: {
    ...ReactReaderStyle.tocButton,
    color: "#f5deb3",
  },
};

export const greenReaderTheme: IReactReaderStyle = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    color: "#3e4e3f",
    fontSize: "30px",
  },
  arrowHover: {
    ...ReactReaderStyle.arrowHover,
    color: "#2f3b30",
  },
  readerArea: {
    ...ReactReaderStyle.readerArea,
    backgroundColor: "#e4f7e7",
    transition: undefined,
  },
  titleArea: {
    ...ReactReaderStyle.titleArea,
    color: "#3e4e3f",
  },
  tocArea: {
    ...ReactReaderStyle.tocArea,
    background: "#d5efe0",
  },
  tocButtonExpanded: {
    ...ReactReaderStyle.tocButtonExpanded,
    background: "#cbe6d6",
  },
  tocButtonBar: {
    ...ReactReaderStyle.tocButtonBar,
    background: "#3e4e3f",
  },
  tocButton: {
    ...ReactReaderStyle.tocButton,
    color: "#e4f7e7",
  },
};
