export const ANNOTATION_COLORS = {
  yellow: { fill: "#FFFFE0", opacity: "0.6" },
  green: { fill: "#C4EBA9", opacity: "0.6" },
  pink: { fill: "#F7CAC9", opacity: "0.6" },
  blue: { fill: "#B3D4FC", opacity: "0.6" },
  orange: { fill: "#FFDAB9", opacity: "0.6" },
};

export type AnnoationColor =
  (typeof ANNOTATION_COLORS)[keyof typeof ANNOTATION_COLORS];
