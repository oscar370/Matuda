#!/bin/bash

matugen_path="$CARGO_HOME/bin/matugen"
script_dir=$(cd "$(dirname "$0")" && pwd)
root_dir=$(dirname "$script_dir")
target_dir="$root_dir/src-tauri/resources/"

echo "[INFO] Installing Matugen"
cargo install matugen

if [ ! -e $matugen_path ]; then
  echo "[ERROR] Matugen doesn't exist in: $matugen_path"
  exit 1
fi

echo "Matugen Path: $matugen_path"

if [ ! -e $target_dir ]; then
  echo "[INFO] Creating the folder binaries in: $target_dir"
  mkdir -p $target_dir
fi

echo "[INFO] Copying the binary to: $target_dir"
cp $matugen_path $target_dir

echo "[INFO] Successfully completed"