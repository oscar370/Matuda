import { ConfigToml } from "@/types";

export function parseConfig(data: Partial<ConfigToml>): ConfigToml {
  const defaultConfig: Partial<ConfigToml> = {
    config: { version_check: false },
    app: {
      color_schema: "scheme-tonal-spot",
      contrast: 0,
      mode: "dark",
      resize_filter: "nearest",
      fallback_color: "#000",
    },
  };

  if (data.templates) {
    Object.values(data.templates).forEach((template) => {
      if (!template.input_path)
        throw new Error("Templates must have input_path");
    });
  }

  return {
    ...defaultConfig,
    ...data,
    app: { ...defaultConfig.app, ...data.app },
    templates: { ...defaultConfig.templates, ...data.templates },
  } as ConfigToml;
}
