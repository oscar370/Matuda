import { useAppStore } from "@/store/useAppStore";
import { Template } from "@/types";
import { useEffect, useState } from "react";

const ACTIVE_TEMPLATE = {
  name: "",
  input_path: "",
  output_path: "",
  pre_hook: "",
  post_hook: "",
};

export function useTemplatesConfig() {
  const [activeTemplate, setActiveTemplate] = useState(ACTIVE_TEMPLATE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const templatesArray = Object.entries(
    useAppStore((state) => state.configToml.templates),
  );

  useEffect(() => {
    if (isModalOpen) return;

    const timeout = setTimeout(() => setActiveTemplate(ACTIVE_TEMPLATE), 150);

    return () => clearTimeout(timeout);
  }, [isModalOpen, setActiveTemplate]);

  function handleTemplateOpen(name: string, template: Template) {
    const data = {
      name,
      ...template,
    };

    setActiveTemplate(data);
    setIsModalOpen(true);
  }

  function handleModalClose() {
    setIsModalOpen(false);
  }

  function handleAddTemplateOpen() {
    setIsModalOpen(true);
  }

  return {
    isModalOpen,
    activeTemplate,
    templatesArray,
    handleTemplateOpen,
    handleModalClose,
    handleAddTemplateOpen,
  };
}
