import {
  Button,
  Group,
  Modal,
  Navigation,
  Option,
  Range,
  Select,
  Switch,
} from "@/components";
import { COLOR_SCHEMAS, RESIZE_FILTERS } from "@/data";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { usePaletteConfig } from "../hooks/usePaletteConfig";

export default function PaletteConfig() {
  const {
    colorSchema,
    contrast,
    mode,
    resizeFilter,
    fallbackColor,
    isModalOpen,
    isModalImportOpen,
    handleSchemaChange,
    handleContrastChange,
    handleDarkChange,
    handleFilterChange,
    handleFallbackOpen,
    handleFallbackChange,
    handleModalClose,
    handleImportConfigClick,
    handleModalImportClose,
    handleImportConfig,
  } = usePaletteConfig();

  return (
    <>
      <Group
        title="Palette config"
        button={
          <Button variant="minimal" onClick={handleImportConfigClick}>
            Import Config
          </Button>
        }
      >
        <Select label="Color schema">
          {COLOR_SCHEMAS.map(({ schema, name }) => (
            <Option
              key={schema}
              label={name}
              value={schema}
              onClick={handleSchemaChange}
              active={schema === colorSchema}
            />
          ))}
        </Select>

        <Range
          label="Contrast"
          value={contrast}
          steps={0.1}
          max={1}
          min={-1}
          onChange={handleContrastChange}
        />

        <Switch
          label="Dark mode"
          checked={mode === "dark"}
          onChange={handleDarkChange}
        />

        <Select label="Resize filter">
          {RESIZE_FILTERS.map(({ filter, name }) => (
            <Option
              key={filter}
              label={name}
              value={filter}
              onClick={handleFilterChange}
              active={filter === resizeFilter}
            />
          ))}
        </Select>

        <Navigation
          label="Fallback color"
          onClick={handleFallbackOpen}
          logo={
            <span
              className="h-6 w-6 rounded-sm"
              style={{ backgroundColor: fallbackColor }}
            ></span>
          }
        />
      </Group>

      <Modal
        title="Select a color"
        isOpen={isModalOpen}
        onClose={handleModalClose}
      >
        <div className="mx-auto flex w-fit flex-col items-center justify-center gap-2 rounded-md bg-(--background) px-4 py-4.5">
          <HexColorPicker
            color={fallbackColor}
            onChange={handleFallbackChange}
          />
          <HexColorInput
            color={fallbackColor}
            onChange={handleFallbackChange}
            className="rounded-sm bg-[color-mix(in_srgb,var(--surface),var(--text)_10%)] px-1 py-1.5"
          />
        </div>
      </Modal>

      <Modal
        title="Import config"
        isOpen={isModalImportOpen}
        onClose={handleModalImportClose}
      >
        <p className="mb-2 text-center">
          <span className="font-bold text-(--accent) uppercase">Warning</span>:
          This will delete your current configuration, including templates, and
          replace it with whatever is in your archive. It is recommended that
          you back up <code>~/.config/matuda/config.toml</code>.
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleModalImportClose}>
            Cancel
          </Button>

          <Button onClick={handleImportConfig}>Continue</Button>
        </div>
      </Modal>
    </>
  );
}
