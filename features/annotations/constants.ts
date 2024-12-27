export const ANNOTATION_COLORS = {
  yellow: { fill: "#FFFFE0", opacity: "0.8" },
  pink: { fill: "#F7CAC9", opacity: "0.8" },
  blue: { fill: "#B3D4FC", opacity: "0.8" },
  orange: { fill: "#FFDAB9", opacity: "0.8" },
};

export type AnnoationColor =
  (typeof ANNOTATION_COLORS)[keyof typeof ANNOTATION_COLORS];

export const SAMPLE_ANNOTATIONS = [
  {
    id: "1",
    type: "NOTE" as const,
    page: 4,
    note: "nice",
  },
  {
    id: "2",
    type: "HIGHLIGHT" as const,
    color: "orange" as const,
    page: 4,
    text: "So God created man in his own image, in the image of God created he",
  },
  {
    id: "3",
    type: "HIGHLIGHT" as const,
    color: "blue" as const,
    page: 4,
    text: "him; male and female created he them. And God blessed them, and God said unto",
  },
  {
    id: "4",
    type: "HIGHLIGHT" as const,
    color: "yellow" as const,
    page: 4,
    text: "and have dominion over the fish of the sea,",
  },
  {
    id: "5",
    type: "HIGHLIGHT" as const,
    color: "pink" as const,
    page: 4,
    text: "upon the earth.",
  },
];
