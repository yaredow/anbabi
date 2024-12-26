export const ANNOTATION_COLORS = {
  yellow: { fill: "#FFFFE0", opacity: "0.8" },
  pink: { fill: "#F7CAC9", opacity: "0.8" },
  blue: { fill: "#B3D4FC", opacity: "0.8" },
  orange: { fill: "#FFDAB9", opacity: "0.8" },
};

export type AnnoationColor =
  (typeof ANNOTATION_COLORS)[keyof typeof ANNOTATION_COLORS];
