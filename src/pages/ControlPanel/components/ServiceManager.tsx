import { Button, Group, Modal, Navigation } from "@/components";
import { useServiceManager } from "../hooks/useServiceManager";
import { ModalContent } from "./ModalContent";

export default function ServiceManager() {
  const { isModalOpen, handleOpenStatus, handleCallService, handleModalClose } =
    useServiceManager();

  return (
    <>
      <Group title="Service manager">
        <Navigation label="Status" onClick={handleOpenStatus} />
        <Button
          onClick={() => handleCallService("start_service", "Service started")}
        >
          Start service
        </Button>
        <Button
          onClick={() =>
            handleCallService("restart_service", "Service restarted")
          }
        >
          Restart service
        </Button>
        <Button
          onClick={() => handleCallService("stop_service", "Service stopped")}
        >
          Stop service
        </Button>
      </Group>

      <Modal
        title="Service status"
        isOpen={isModalOpen}
        onClose={handleModalClose}
      >
        <ModalContent />
      </Modal>
    </>
  );
}
