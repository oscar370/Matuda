import { useAppStore } from "@/store/useAppStore";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function useAppManger() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isCustomCSS = useAppStore((state) => state.isCustomCSS);
  const setIsCustomCSS = useAppStore((state) => state.setIsCustomCSS);
  const setIsBusy = useAppStore((state) => state.setIsBusy);
  const reset = useAppStore((state) => state.reset);
  const setCustomCSS = useAppStore((state) => state.setCustomCSS);
  const setIsServiceInstalled = useAppStore(
    (state) => state.setIsServiceInstalled,
  );

  useEffect(() => {
    if (!isCustomCSS) handleCleanStyles();
  }, [isCustomCSS]);

  function handleActivateStylesChange(value: boolean) {
    setIsCustomCSS(value);
  }

  async function handleLoadStyles() {
    if (!isCustomCSS) return;

    setIsBusy(true);

    try {
      const styles = await invoke<string>("load_styles");
      const styleNode = document.querySelector("#custom-css");

      if (styleNode) {
        styleNode.textContent = styles;
        setCustomCSS(styles);
        toast.success("Applied styles");
      } else {
        const node = document.createElement("style");
        node.textContent = styles;
        node.id = "custom-css";

        document.head.appendChild(node);
        setCustomCSS(styles);
        toast.success("Applied styles");
      }
    } catch (error) {
      toast.error(`Failed to apply styles: ${error}`);
    } finally {
      setIsBusy(false);
    }
  }

  function handleCleanStyles() {
    const styleNode = document.querySelector("#custom-css");

    if (styleNode) styleNode.remove();
  }

  async function handleCleanApp() {
    setIsBusy(true);

    try {
      handleCleanStyles();
      useAppStore.persist.clearStorage();
      reset();
      await invoke("clean_app");
      toast.success("Application cleaned");
      setIsServiceInstalled(false);
    } catch (error) {
      toast.error(`Failed to clean the app: ${error}`);
    } finally {
      setIsBusy(false);
    }
  }

  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCancelClean() {
    setIsModalOpen(false);
  }

  async function handleReinstallBinaries() {
    setIsBusy(true);

    try {
      await invoke("reinstall_binaries_service");
      toast.success("Reinstalled binaries and service");
    } catch (error) {
      toast.error(`Failed to reinstall the binaries or service: ${error}`);
      setIsServiceInstalled(false);
    } finally {
      setIsBusy(false);
    }
  }

  return {
    isModalOpen,
    isCustomCSS,
    handleActivateStylesChange,
    handleLoadStyles,
    handleCleanApp,
    handleOpenModal,
    handleCancelClean,
    handleReinstallBinaries,
  };
}
