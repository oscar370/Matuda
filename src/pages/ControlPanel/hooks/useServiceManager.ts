import { useAppStore } from "@/store/useAppStore";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import toast from "react-hot-toast";

export function useServiceManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const setIsBusy = useAppStore((state) => state.setIsBusy);

  function handleOpenStatus() {
    setIsModalOpen(true);
  }

  async function handleCallService(command: string, message: string) {
    setIsBusy(true);

    try {
      await invoke(command);
      setIsBusy(false);
      toast.success(message);
    } catch (error) {
      toast.error(`Failed to invoke the command: ${error}`);
    }
  }

  function handleModalClose() {
    setIsModalOpen(false);
  }

  return {
    isModalOpen,
    handleOpenStatus,
    handleCallService,
    handleModalClose,
  };
}
