import { useAppStore } from "@/store/useAppStore";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import toast from "react-hot-toast";

export function useSaveConfig() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const configToml = useAppStore((state) => state.configToml);
  const setIsBusy = useAppStore((state) => state.setIsBusy);

  function handleModalOpen() {
    setIsModalOpen(true);
  }

  function handleCancelSave() {
    setIsModalOpen(false);
  }

  async function handleSaveConfig() {
    setIsBusy(true);

    try {
      await invoke("setup_config", { invokeConfig: configToml });
      toast.success("Saved config");
    } catch (error) {
      toast.error(`Failed to save config: ${error}`);
    } finally {
      setIsBusy(false);
      setIsModalOpen(false);
    }
  }
  return {
    isModalOpen,
    handleModalOpen,
    handleCancelSave,
    handleSaveConfig,
  };
}
