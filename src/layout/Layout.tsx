import LoadingScreen from "@/components/LoadingScreen";
import SidebarItem from "@/components/SidebarItem";
import SplitView from "@/components/SplitView";
import { useAppStore } from "@/store/useAppStore";
import { invoke } from "@tauri-apps/api/core";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function Layout() {
  const actualView = useAppStore((state) => state.actualView);
  const isBusy = useAppStore((state) => state.isBusy);
  const location = useLocation().pathname;
  const customCSS = useAppStore((state) => state.customCSS);
  const isCustomCSS = useAppStore((state) => state.isCustomCSS);
  const setActualView = useAppStore((state) => state.setActualView);
  const navigate = useNavigate();
  const setIsServiceInstalled = useAppStore(
    (state) => state.setIsServiceInstalled,
  );

  useEffect(() => {
    async function handleLocationChange() {
      try {
        const result = await invoke<boolean>("is_service_installed");

        setIsServiceInstalled(result);

        if (location !== "/" && result === false) {
          navigate("/");
        }

        switch (location) {
          case "/":
            setActualView("Control Panel");
            break;
          case "/matugen-config":
            setActualView("Matugen Config");
        }
      } catch (error) {}
    }

    handleLocationChange();
  }, [location]);

  useEffect(() => {
    if (isCustomCSS && customCSS) {
      const node = document.createElement("style");
      node.textContent = customCSS;
      node.id = "custom-css";

      document.head.appendChild(node);
      toast.success("Applied styles");
    }
  }, [isCustomCSS]);

  return (
    <>
      <LoadingScreen message="Running command..." isLoading={isBusy} />
      <Toaster
        toastOptions={{
          className: "!bg-(--surface) !text-(--text)",
          position: "bottom-right",
        }}
      />
      <SplitView
        titleSidebar="Matuda"
        titleMain={actualView}
        MainContent={<Outlet />}
        SidebarContent={<SidebarContent />}
      />
    </>
  );
}

function SidebarContent() {
  const isServiceNotInstalled = useAppStore(
    (state) => !state.isServiceInstalled,
  );

  return (
    <div className="flex flex-col gap-2">
      <SidebarItem label="Control panel" to="/" />
      <SidebarItem
        label="Matugen config"
        to="/matugen-config"
        disabled={isServiceNotInstalled}
      />
    </div>
  );
}
