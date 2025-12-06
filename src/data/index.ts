export const COLOR_SCHEMAS = [
  { schema: "scheme-content", name: "Content" },
  { schema: "scheme-expressive", name: "Expressive" },
  { schema: "scheme-fidelity", name: "Fidelity" },
  { schema: "scheme-fruit-salad", name: "Fruit Salad" },
  { schema: "scheme-monochrome", name: "Monochrome" },
  { schema: "scheme-neutral", name: "Neutral" },
  { schema: "scheme-rainbow", name: "Rainbow" },
  { schema: "scheme-tonal-spot", name: "Tonal Spot" },
  { schema: "scheme-vibrant", name: "Vibrant" },
] as const;

export const RESIZE_FILTERS = [
  { filter: "nearest", name: "Nearest" },
  { filter: "triangle", name: "Triangle" },
  { filter: "catmull-rom", name: "Catmull-Rom" },
  { filter: "gaussian", name: "Gaussian" },
  { filter: "lanczos3", name: "Lanczos3" },
] as const;
