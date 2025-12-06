import { useAppStore } from "@/store/useAppStore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function useModalTemplateContent(
  name: string,
  inputPath: string,
  outputPath: string,
  preHook: string,
  postHook: string,
  handleModalClose: () => void,
) {
  const [form, setForm] = useState({
    name,
    inputPath,
    outputPath,
    preHook,
    postHook,
  });
  const templates = useAppStore((state) => state.configToml.templates);
  const setEditTemplate = useAppStore((state) => state.setEditTemplate);
  const setAddTemplate = useAppStore((state) => state.setAddTemplate);
  const setDeleteTemplate = useAppStore((state) => state.setDeleteTemplate);

  useEffect(() => {
    setForm({ name, inputPath, outputPath, preHook, postHook });
  }, [name, inputPath, outputPath]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (form.name === "") {
      toast.error("The name cannot be empty.");
      return;
    }

    if (name !== form.name && form.name in templates) {
      toast.error("Duplicate template name");
      return;
    }

    if (form.inputPath === "") {
      toast.error("The Input Path field cannot be empty");
      return;
    }

    const data = {
      input_path: form.inputPath,
      output_path: form.outputPath,
      pre_hook: form.preHook,
      post_hook: form.postHook,
    };

    if (name) {
      setEditTemplate(name, form.name, data);
      toast.success("Changes applied");
    } else {
      setAddTemplate(form.name, data);
      toast.success("Template added");
    }

    handleModalClose();
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const newValue = name === "name" ? value.replace(/\s+/g, "") : value;

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  }

  function handleDeleteTemplate(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    e.preventDefault();

    if (name in templates === false) {
      toast.error("You cannot delete a template that does not exist");
      return;
    }

    setDeleteTemplate(name);

    handleModalClose();
    toast.success("The template has been removed");
  }

  return {
    form,
    handleSubmit,
    handleInputChange,
    handleDeleteTemplate,
  };
}
