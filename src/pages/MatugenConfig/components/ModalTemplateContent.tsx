import { Button, FieldText, Form } from "@/components";
import { useModalTemplateContent } from "../hooks/useModalTemplateContent";

type TemplateModalProps = {
  name: string;
  inputPath: string;
  outputPath: string;
  preHook: string;
  postHook: string;
  handleModalClose: () => void;
};

export default function ModalTemplateContent({
  name,
  inputPath,
  outputPath,
  preHook,
  postHook,
  handleModalClose,
}: TemplateModalProps) {
  const { form, handleSubmit, handleInputChange, handleDeleteTemplate } =
    useModalTemplateContent(
      name,
      inputPath,
      outputPath,
      preHook,
      postHook,
      handleModalClose,
    );

  return (
    <Form onSubmit={handleSubmit}>
      <FieldText
        label="Name"
        name="name"
        value={form.name}
        onChange={handleInputChange}
      />
      <FieldText
        label="Input path"
        name="inputPath"
        value={form.inputPath}
        onChange={handleInputChange}
      />
      <FieldText
        label="Output path"
        name="outputPath"
        value={form.outputPath}
        onChange={handleInputChange}
      />
      <FieldText
        label="Pre hook"
        name="preHook"
        value={form.preHook}
        onChange={handleInputChange}
      />
      <FieldText
        label="Post hook"
        name="postHook"
        value={form.postHook}
        onChange={handleInputChange}
      />

      <div className="mt-2 flex gap-2">
        <Button variant="secondary" onClick={handleDeleteTemplate}>
          Delete
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </Form>
  );
}
