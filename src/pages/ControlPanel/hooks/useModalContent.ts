import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function useModalContent() {
  const [serviceStatus, setServiceStatus] = useState("");

  useEffect(() => {
    setupServiceStatus();
  }, [setupServiceStatus]);

  async function handleRefreshStatus() {
    await setupServiceStatus();
    toast.success("State refreshed");
  }

  async function setupServiceStatus() {
    try {
      const status = await invoke<string>("get_service_status");
      setServiceStatus(status);
    } catch (error) {
      toast.error(`Failed to obtain service status: ${error}`);
    }
  }

  return {
    serviceStatus,
    handleRefreshStatus,
  };
}
