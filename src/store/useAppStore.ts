import {
  AppConfig,
  ColorSchema,
  ConfigToml,
  ResizeFilter,
  Template,
} from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AppStore = AppState & AppActions;

type AppState = {
  actualView: string;
  isBusy: boolean;
  isServiceInstalled: boolean;
  customCSS: string;
  isCustomCSS: boolean;
  configToml: ConfigToml;
};

type AppActions = {
  setActualView: (value: string) => void;
  setIsBusy: (value: boolean) => void;
  setIsServiceInstalled: (value: boolean) => void;
  setCustomCSS: (value: string) => void;
  setIsCustomCSS: (value: boolean) => void;
  setColorSchema: (value: ColorSchema) => void;
  setContrast: (value: number) => void;
  setMode: (value: "dark" | "light") => void;
  setResizeFilter: (value: ResizeFilter) => void;
  setFallbackColor: (value: string) => void;
  setEditTemplate: (oldKey: string, key: string, data: Template) => void;
  setAddTemplate: (key: string, data: Template) => void;
  setDeleteTemplate: (key: string) => void;
  setImportFile: (data: ConfigToml) => void;
  reset: () => void;
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, _, store) => ({
      actualView: "Control Panel",
      isBusy: false,
      isServiceInstalled: false,
      customCSS: "",
      isCustomCSS: false,
      configToml: {
        config: {
          version_check: false,
        },
        app: {
          color_schema: "scheme-tonal-spot",
          contrast: 0,
          mode: "dark",
          resize_filter: "nearest",
          fallback_color: "#000",
        },
        templates: {
          customCSS: {
            input_path: "~/.config/matuda/matuda-template.css",
            output_path: "~/.config/matuda/matuda.css",
            pre_hook: "",
            post_hook: "",
          },
        },
      },
      setActualView: (value) => set({ actualView: value }),
      setIsBusy: (value) => set({ isBusy: value }),
      setIsServiceInstalled: (value) => set({ isServiceInstalled: value }),
      setCustomCSS: (value) => set({ customCSS: value }),
      setIsCustomCSS: (value) => set({ isCustomCSS: value }),
      setColorSchema: (value) =>
        set((state) => updateAppConfig(state, "color_schema", value)),
      setContrast: (value) =>
        set((state) => updateAppConfig(state, "contrast", value)),
      setMode: (value) => set((state) => updateAppConfig(state, "mode", value)),
      setResizeFilter: (value) =>
        set((state) => updateAppConfig(state, "resize_filter", value)),
      setFallbackColor: (value) =>
        set((state) => updateAppConfig(state, "fallback_color", value)),
      setEditTemplate: (oldKey, key, data) =>
        set((state) => {
          const { [oldKey]: _, ...rest } = state.configToml.templates;

          return {
            ...state,
            configToml: {
              ...state.configToml,
              templates: {
                ...rest,
                [key]: data,
              },
            },
          };
        }),
      setAddTemplate: (key, data) =>
        set((state) => ({
          ...state,
          configToml: {
            ...state.configToml,
            templates: {
              ...state.configToml.templates,
              [key]: data,
            },
          },
        })),
      setDeleteTemplate: (key) =>
        set((state) => {
          const { [key]: _, ...rest } = state.configToml.templates;

          return {
            ...state,
            configToml: {
              ...state.configToml,
              templates: {
                ...rest,
              },
            },
          };
        }),
      setImportFile: (data) => set({ configToml: data }),
      reset: () => set(store.getInitialState()),
    }),
    { name: "app-store" },
  ),
);

function updateAppConfig<K extends keyof AppConfig>(
  state: AppStore,
  key: K,
  value: AppConfig[K],
) {
  return {
    ...state,
    configToml: {
      ...state.configToml,
      app: { ...state.configToml.app, [key]: value },
    },
  };
}
