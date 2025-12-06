use ::serde::{Deserialize, Serialize};
use clap::Parser;
use gio::prelude::*;
use glib::MainLoop;
use image::ImageReader;
use std::panic;
use std::{
    collections::HashMap,
    env::temp_dir,
    fs::{self, File},
    io::BufReader,
    path::PathBuf,
    process::Command,
};

#[derive(Serialize, Deserialize, Debug)]
struct ConfigToml {
    app: AppConfig,
    templates: HashMap<String, TemplateConfig>,
}

#[derive(Serialize, Deserialize, Debug)]
struct AppConfig {
    color_schema: String,
    contrast: f64,
    mode: String,
    resize_filter: String,
    fallback_color: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct TemplateConfig {
    input_path: String,
    output_path: String,
}

#[derive(Parser)]
struct Args {
    #[arg(long)]
    config: String,

    #[arg(long)]
    matugen: String,
}

fn main() {
    let args = Args::parse();
    let config_path = args.config.clone();
    let matugen_path = args.matugen.clone();
    let settings = gio::Settings::new("org.gnome.desktop.background");

    println!("[INFO] Configuration path: {}", &config_path);
    println!("[INFO] Matugen path: {}", &matugen_path);
    println!("[INFO] Watcher initiated");

    settings.connect_changed(Some("picture-uri"), move |s, _| {
        let uri = s.string("picture-uri");
        let path = PathBuf::from(uri.strip_prefix("file://").unwrap_or(&uri));
        let config = get_config(&config_path)
            .map_err(|e| println!("[ERROR] Failed reading config: {}", e))
            .unwrap();

        println!("[INFO] Wallpaper changed: {}", path.display());

        if !path.exists() {
            println!("[ERROR] The file doesn't exist in: {}", path.display());
            return;
        }

        let reader = match get_process_image(&path) {
            Ok(r) => r,
            Err(e) => {
                println!("[ERROR] Failed to process the image: {}", e);
                return;
            }
        };

        let format = match reader.format() {
            Some(f) => f,
            None => {
                println!("[ERROR] Could not guess image format");
                generate_with_fallback(&matugen_path, &config_path, &config);
                return;
            }
        };

        let ext = format.extensions_str()[0];
        let temp_path = temp_dir().join(format!("wallpaper_tmp.{}", ext));

        println!("[INFO] Copying image to: {}", temp_path.display());

        if let Err(e) = fs::copy(&path, &temp_path) {
            println!("[ERROR] Failed to copy image: {}", e);
            return;
        }

        generate_with_image(&matugen_path, &config_path, &temp_path, &config);
        clean(&temp_path);
    });

    MainLoop::new(None, false).run();
}

fn get_process_image(
    path: &PathBuf,
) -> Result<ImageReader<BufReader<File>>, Box<dyn std::error::Error>> {
    let result = panic::catch_unwind(|| ImageReader::open(path)?.with_guessed_format());

    match result {
        Ok(Ok(reader)) => Ok(reader),
        Ok(Err(e)) => Err(e.into()),
        Err(_) => Err("Image format handler panicked".into()),
    }
}

fn get_config(path: &str) -> Result<ConfigToml, String> {
    let content =
        fs::read_to_string(path).map_err(|e| format!("Failed to read config file: {}", e))?;

    let config: ConfigToml =
        toml::from_str(&content).map_err(|e| format!("Failed to parse TOML: {}", e))?;

    Ok(config)
}

fn generate_with_fallback(matugen_path: &String, config_path: &String, config: &ConfigToml) {
    println!("Generating palette with fallback color");

    match Command::new(&matugen_path)
        .arg("color")
        .arg("hex")
        .arg(&config.app.fallback_color.replace("#", ""))
        .arg("-t")
        .arg(&config.app.color_schema)
        .arg("--contrast")
        .arg(&config.app.contrast.to_string())
        .arg("-m")
        .arg(&config.app.mode)
        .arg("-r")
        .arg(&config.app.resize_filter)
        .arg("-c")
        .arg(&config_path)
        .output()
    {
        Ok(output) => {
            let stdout = String::from_utf8_lossy(&output.stdout).to_string();
            let stderr = String::from_utf8_lossy(&output.stderr).to_string();

            println!("[INFO] Exit status: {}", output.status);

            if !stdout.is_empty() {
                println!("[STDOUT] {}", stdout);
            }

            if !stderr.is_empty() {
                println!("[STDERR] {}", stderr);
            }

            if !output.status.success() {
                println!("[ERROR] Matugen failed with status: {}", output.status);
            }
        }
        Err(e) => {
            println!("[ERROR] Failed to execute Matugen: {}", e)
        }
    };
}

fn generate_with_image(
    matugen_path: &String,
    config_path: &String,
    temp_path: &PathBuf,
    config: &ConfigToml,
) {
    println!("Generating palette with image");

    match Command::new(&matugen_path)
        .arg("image")
        .arg(&temp_path)
        .arg("-t")
        .arg(&config.app.color_schema)
        .arg("--contrast")
        .arg(&config.app.contrast.to_string())
        .arg("-m")
        .arg(&config.app.mode)
        .arg("-r")
        .arg(&config.app.resize_filter)
        .arg("-c")
        .arg(&config_path)
        .arg("--fallback-color")
        .arg(&config.app.fallback_color.replace("#", ""))
        .output()
    {
        Ok(output) => {
            let stdout = String::from_utf8_lossy(&output.stdout).to_string();
            let stderr = String::from_utf8_lossy(&output.stderr).to_string();

            println!("[INFO] Exit status: {}", output.status);

            if !stdout.is_empty() {
                println!("[STDOUT] {}", stdout);
            }

            if !stderr.is_empty() {
                println!("[STDERR] {}", stderr);
            }

            if !output.status.success() {
                println!("[ERROR] Matugen failed with status: {}", output.status);
            }
        }
        Err(e) => {
            println!("[ERROR] Failed to execute Matugen: {}", e)
        }
    };
}

fn clean(temp_path: &PathBuf) {
    println!("[INFO] Deleting image in: {}", temp_path.display());

    if let Err(e) = fs::remove_file(&temp_path) {
        println!("[ERROR] Failed to delete image: {}", e);
        return;
    }
}
