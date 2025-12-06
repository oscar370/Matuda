import { useAppStore } from "@/store/useAppStore";
import { ColorSchema, ResizeFilter } from "@/types";
import { useState } from "react";

export function usePaletteConfig() {
  const colorSchema = useAppStore((state) => state.configToml.app.color_schema);
  const contrast = useAppStore((state) => state.configToml.app.contrast);
  const mode = useAppStore((state) => state.configToml.app.mode);
  const fallbackColor = useAppStore(
    (state) => state.configToml.app.fallback_color,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const setFallbackColor = useAppStore((state) => state.setFallbackColor);
  const setColorSchema = useAppStore((state) => state.setColorSchema);
  const setContrast = useAppStore((state) => state.setContrast);
  const setMode = useAppStore((state) => state.setMode);
  const resizeFilter = useAppStore(
    (state) => state.configToml.app.resize_filter,
  );
  const setResizeFilter = useAppStore((state) => state.setResizeFilter);

  function handleSchemaChange(value: string) {
    setColorSchema(value as ColorSchema);
  }

  function handleContrastChange(value: string) {
    setContrast(Number(value));
  }

  function handleDarkChange(e: boolean) {
    e ? setMode("dark") : setMode("light");
  }

  function handleFilterChange(value: string) {
    setResizeFilter(value as ResizeFilter);
  }

  function handleFallbackOpen() {
    setIsModalOpen(true);
  }

  function handleFallbackChange(color: string) {
    setFallbackColor(color);
  }

  function handleModalClose() {
    setIsModalOpen(false);
  }

  return {
    colorSchema,
    contrast,
    mode,
    resizeFilter,
    fallbackColor,
    isModalOpen,
    handleSchemaChange,
    handleContrastChange,
    handleDarkChange,
    handleFilterChange,
    handleFallbackOpen,
    handleFallbackChange,
    handleModalClose,
  };
}
