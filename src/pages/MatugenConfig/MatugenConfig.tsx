import PaletteConfig from "./components/PaletteConfig";
import SaveConfig from "./components/SaveConfig";
import TemplatesConfig from "./components/TemplatesConfig";

export default function MatugenConfig() {
  return (
    <div className="flex flex-col gap-4">
      <PaletteConfig />
      <TemplatesConfig />

      <SaveConfig />
    </div>
  );
}
