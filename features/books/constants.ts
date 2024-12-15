import { IReactReaderStyle, ReactReaderStyle } from "react-reader";

export const themes = [
  { name: "white", backgroundColor: "#ffffff", textColor: "#000000" },
  { name: "dark", backgroundColor: "#000000", textColor: "#ffffff" },
  { name: "sepia", backgroundColor: "#f5deb3", textColor: "#5b4636" },
];

export const lightReaderTheme: IReactReaderStyle = {
  ...ReactReaderStyle,
  readerArea: {
    ...ReactReaderStyle.readerArea,
    transition: undefined,
    background: "#fff",
    color: "#000",
  },
};

export const darkReaderTheme: IReactReaderStyle = {
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

export const sepiaReaderTheme: IReactReaderStyle = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    color: "#5b4636",
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
