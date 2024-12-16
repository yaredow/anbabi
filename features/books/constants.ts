import { IReactReaderStyle, ReactReaderStyle } from "react-reader";

export const themes = [
  { name: "light", backgroundColor: "#ffffff", textColor: "#000000" },
  { name: "dark", backgroundColor: "#000000", textColor: "#ffffff" },
  { name: "sepia", backgroundColor: "#f5deb3", textColor: "#5b4636" },
  { name: "greenish", backgroundColor: "#e4f7e7", textColor: "#3e4e3f" },
];

export const fontFamilies = [
  { name: "Amazon Ember", path: "/fonts/amazon-ember/Amazom Ember.ttf" },
  { name: "Palatino", path: "/fonts/palatino/palr45w.ttf" },
  {
    name: "Open Dyslexic",
    path: "/fonts/opendyslexic/OpenDyslexic-Regular.ttf",
  },
  { name: "Lucida", path: "" },
  { name: "Helvetica", path: "/fonts/howvetica/Howvetica-Aayp.ttf" },
  { name: "Georgia", path: "/fonts/georgia-2/georgia.ttf" },
  { name: "Baskerville", path: "/fonts/baskerville/baskerville bold.ttf" },
  { name: "Bookerly", path: "/fonts/Bookerly.ttf" },
];

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
    color: "#000",
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
