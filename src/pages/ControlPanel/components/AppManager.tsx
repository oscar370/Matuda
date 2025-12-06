import { Button, Group, Modal, Switch } from "@/components";
import { useAppManger } from "../hooks/useAppManager";

export default function AppManager() {
  const {
    isModalOpen,
    isCustomCSS,
    handleActivateStylesChange,
    handleLoadStyles,
    handleCleanApp,
    handleOpenModal,
    handleCancelClean,
  } = useAppManger();

  return (
    <>
      <Group title="App manager">
        <Switch
          label="Activate custom styles"
          checked={isCustomCSS}
          onChange={handleActivateStylesChange}
        />
        <Button onClick={handleLoadStyles}>Load styles</Button>
        <Button onClick={handleOpenModal}>Clean app</Button>
      </Group>

      <Modal title="Clean app" isOpen={isModalOpen} onClose={handleCancelClean}>
        <p className="mb-2 text-center">
          <span className="font-bold text-(--accent) uppercase">Warning</span>:
          This will delete the binaries, the service, and the configuration
          file. Including everything else in <code>~/.config/matuda</code>.
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleCancelClean}>
            Cancel
          </Button>

          <Button onClick={handleCleanApp}>Continue</Button>
        </div>
      </Modal>
    </>
  );
}
