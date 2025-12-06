#!/bin/bash

script_dir=$(cd "$(dirname "$0")" && pwd)
root_dir=$(dirname "$script_dir")
target_dir="$root_dir/src-tauri/resources/"
daemon_dir="$root_dir/daemon/"
daemon_path="$root_dir/daemon/target/release/daemon"

echo "[INFO] Starting daemon compilation"
cd $daemon_dir
cargo build --release

if [! -e $daemon_path]; then
  echo "[ERROR] The daemon binary was not found in: $daemon_path"
  exit 1
fi

if [ ! -e $target_dir ]; then
  echo "[INFO] Creating the folder binaries in: $target_dir"
  mkdir -p $target_dir
fi

echo "[INFO] Copying daemon binary to: $target_dir"
cp $daemon_path $target_dir

echo "[INFO] Successfully completed"