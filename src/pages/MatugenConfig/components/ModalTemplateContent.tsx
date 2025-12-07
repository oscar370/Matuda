import { Button, FieldText, Form } from "@/components";
import { useModalTemplateContent } from "../hooks/useModalTemplateContent";

type TemplateModalProps = {
  name: string;
  inputPath: string;
  outputPath: string | null;
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
        placeholder="Optional field"
      />
      <FieldText
        label="Pre hook"
        name="preHook"
        value={form.preHook}
        onChange={handleInputChange}
        placeholder="Optional field"
      />
      <FieldText
        label="Post hook"
        name="postHook"
        value={form.postHook}
        onChange={handleInputChange}
        placeholder="Optional field"
      />

      <div className="mt-2 flex gap-2">
        <Button variant="secondary" onClick={(e) => handleDeleteTemplate(e)}>
          Delete
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </Form>
  );
}
