import { useAppStore } from "@/store/useAppStore";
import { invoke } from "@tauri-apps/api/core";
import toast from "react-hot-toast";

export function useControlPanel() {
  const configToml = useAppStore((state) => state.configToml);
  const setIsBusy = useAppStore((state) => state.setIsBusy);
  const isServiceInstalled = useAppStore((state) => state.isServiceInstalled);
  const setIsServiceInstalled = useAppStore(
    (state) => state.setIsServiceInstalled,
  );

  async function handleInitApp() {
    setIsBusy(true);

    try {
      await invoke("init_app", { invokeConfig: configToml });
      toast.success("Application initialized");
      setIsServiceInstalled(true);
    } catch (error) {
      toast.error(`Failed to initialize the app: ${error}`);
      setIsServiceInstalled(false);
    } finally {
      setIsBusy(false);
    }
  }

  return {
    isServiceInstalled,
    handleInitApp,
  };
}
