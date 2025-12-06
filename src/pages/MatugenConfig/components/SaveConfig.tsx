import { Button, Modal } from "@/components";
import { useSaveConfig } from "../hooks/useSaveConfig";

export default function SaveConfig() {
  const { isModalOpen, handleModalOpen, handleCancelSave, handleSaveConfig } =
    useSaveConfig();

  return (
    <>
      <Button onClick={handleModalOpen}>Save config</Button>

      <Modal
        title="Save config"
        isOpen={isModalOpen}
        onClose={handleCancelSave}
      >
        <p className="mb-2 text-center">
          <span className="font-bold text-(--accent) uppercase">Warning</span>:
          This overwrites the file. If you modified it manually, you will lose
          the data.
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleCancelSave}>
            Cancel
          </Button>

          <Button onClick={handleSaveConfig}>Continue</Button>
        </div>
      </Modal>
    </>
  );
}
