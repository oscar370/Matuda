export type ConfigToml = {
  config: MatugenConfig;
  app: AppConfig;
  templates: Record<string, Template>;
};

type MatugenConfig = {
  version_check: boolean;
};

export type AppConfig = {
  color_schema: ColorSchema;
  contrast: number;
  mode: "dark" | "light";
  resize_filter: ResizeFilter;
  fallback_color: string;
};

export type Template = {
  input_path: string;
  output_path: string | null;
  pre_hook: string;
  post_hook: string;
};

export type ColorSchema =
  | "scheme-content"
  | "scheme-expressive"
  | "scheme-fidelity"
  | "scheme-fruit-salad"
  | "scheme-monochrome"
  | "scheme-neutral"
  | "scheme-rainbow"
  | "scheme-tonal-spot"
  | "scheme-vibrant";

export type ResizeFilter =
  | "nearest"
  | "triangle"
  | "catmull-rom"
  | "gaussian"
  | "lanczos3";
