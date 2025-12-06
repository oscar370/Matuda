import { Button, Group, Modal, Navigation } from "@/components";
import { useTemplatesConfig } from "../hooks/useTemplatesConfig";
import ModalTemplateContent from "./ModalTemplateContent";

export default function TemplatesConfig() {
  const {
    isModalOpen,
    activeTemplate,
    templatesArray,
    handleTemplateOpen,
    handleModalClose,
    handleAddTemplateOpen,
  } = useTemplatesConfig();
  const { name, input_path, output_path, pre_hook, post_hook } = activeTemplate;
  const titleModal =
    activeTemplate.name === "" ? "Add template" : `Edit ${name}`;

  return (
    <>
      <Group
        title="Templates"
        button={
          <Button
            variant="minimal"
            className="flex! items-center! gap-2!"
            onClick={handleAddTemplateOpen}
          >
            <ButtonAdd />
          </Button>
        }
      >
        {templatesArray.map(([name, template]) => (
          <Navigation
            key={name}
            label={name}
            onClick={() => handleTemplateOpen(name, template)}
          />
        ))}
      </Group>

      <Modal title={titleModal} isOpen={isModalOpen} onClose={handleModalClose}>
        <ModalTemplateContent
          name={name}
          inputPath={input_path}
          outputPath={output_path}
          preHook={pre_hook}
          postHook={post_hook}
          handleModalClose={handleModalClose}
        />
      </Modal>
    </>
  );
}

function ButtonAdd() {
  return (
    <>
      <p>Add template</p>
      <svg
        height="16px"
        viewBox="0 0 16 16"
        width="16px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="m 7 1 v 6 h -6 v 2 h 6 v 6 h 2 v -6 h 6 v -2 h -6 v -6 z m 0 0"
          fill="currentColor"
        />
      </svg>
    </>
  );
}
