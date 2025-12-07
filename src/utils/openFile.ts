import { open } from "@tauri-apps/plugin-dialog";
import { readTextFile } from "@tauri-apps/plugin-fs";

export async function openFile() {
  const path = await open({
    multiple: false,
    directory: false,
    filters: [{ name: "config", extensions: ["toml"] }],
  });

  if (!path) throw new Error("The user canceled the selection");

  const content = await readTextFile(path);

  return content;
}
