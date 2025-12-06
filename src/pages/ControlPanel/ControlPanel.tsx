import Button from "@/components/Button";
import AppManager from "./components/AppManager";
import ServiceManager from "./components/ServiceManager";
import { useControlPanel } from "./hooks/useControlPanel";

export default function ControlPanel() {
  const { isServiceInstalled, handleInitApp } = useControlPanel();

  return isServiceInstalled ? (
    <div className="flex flex-col gap-4">
      <ServiceManager />
      <AppManager />
    </div>
  ) : (
    <Button onClick={handleInitApp}>Initialize the app</Button>
  );
}
