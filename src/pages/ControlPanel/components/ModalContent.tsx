import { Button } from "@/components";
import { useModalContent } from "../hooks/useModalContent";

export function ModalContent() {
  const { serviceStatus, handleRefreshStatus } = useModalContent();

  return (
    <div className="text-center">
      <pre className="mb-3 text-left wrap-break-word whitespace-pre-wrap">
        {serviceStatus}
      </pre>

      <Button variant="primary" onClick={handleRefreshStatus}>
        Refresh status
      </Button>
    </div>
  );
}
