import { useAppStore } from "@/store/useAppStore";
import { ColorSchema, ConfigToml, ResizeFilter } from "@/types";
import { openFile } from "@/utils/openFile";
import { parseConfig } from "@/utils/parseConfig";
import { load } from "js-toml";
import { useState } from "react";
import toast from "react-hot-toast";

export function usePaletteConfig() {
  const colorSchema = useAppStore((state) => state.configToml.app.color_schema);
  const contrast = useAppStore((state) => state.configToml.app.contrast);
  const mode = useAppStore((state) => state.configToml.app.mode);
  const fallbackColor = useAppStore(
    (state) => state.configToml.app.fallback_color,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalImportOpen, setIsModalImportOpen] = useState(false);
  const setFallbackColor = useAppStore((state) => state.setFallbackColor);
  const setColorSchema = useAppStore((state) => state.setColorSchema);
  const setContrast = useAppStore((state) => state.setContrast);
  const setMode = useAppStore((state) => state.setMode);
  const resizeFilter = useAppStore(
    (state) => state.configToml.app.resize_filter,
  );
  const setResizeFilter = useAppStore((state) => state.setResizeFilter);
  const setIsBusy = useAppStore((store) => store.setIsBusy);
  const setImportFile = useAppStore((state) => state.setImportFile);

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

  function handleImportConfigClick() {
    setIsModalImportOpen(true);
  }

  function handleModalImportClose() {
    setIsModalImportOpen(false);
  }

  async function handleImportConfig() {
    setIsBusy(true);
    try {
      const file = await openFile();
      const data = load(file) as Partial<ConfigToml>;
      const finalConfig = parseConfig(data);

      setImportFile(finalConfig);
      toast.success("Import completed successfully");
    } catch (error) {
      toast.error(`${error}`);
      console.error(error);
    } finally {
      setIsBusy(false);
      handleModalImportClose();
    }
  }

  return {
    colorSchema,
    contrast,
    mode,
    resizeFilter,
    fallbackColor,
    isModalOpen,
    isModalImportOpen,
    handleSchemaChange,
    handleContrastChange,
    handleDarkChange,
    handleFilterChange,
    handleFallbackOpen,
    handleFallbackChange,
    handleModalClose,
    handleImportConfigClick,
    handleModalImportClose,
    handleImportConfig,
  };
}
