use ini::Ini;
use serde::{Deserialize, Serialize};
use std::{
    collections::HashMap,
    env,
    fs::{self},
    path::PathBuf,
    process::Command,
};
use tauri::{path::BaseDirectory, AppHandle, Manager};
use toml;

#[derive(Serialize, Deserialize, Debug)]
pub struct ConfigToml {
    config: MatugenConfig,
    app: AppConfig,
    templates: HashMap<String, TemplateConfig>,
}

#[derive(Serialize, Deserialize, Debug)]
struct MatugenConfig {
    version_check: bool,
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
    pre_hook: String,
    post_hook: String,
}

#[derive(Default)]
pub struct Daemon {
    base_dir: PathBuf,
    config_dir: PathBuf,
    daemon_path: PathBuf,
    matugen_path: PathBuf,
    service_dir: PathBuf,
    service_path: PathBuf,
    service_name: String,
    config_path: PathBuf,
    styles_path: PathBuf,
}

impl Daemon {
    pub fn new() -> Self {
        Self {
            base_dir: PathBuf::new(),
            config_dir: PathBuf::new(),
            daemon_path: PathBuf::new(),
            matugen_path: PathBuf::new(),
            service_dir: PathBuf::new(),
            service_path: PathBuf::new(),
            service_name: "matuda-daemon.service".into(),
            config_path: PathBuf::new(),
            styles_path: PathBuf::new(),
        }
    }

    pub fn get_config_dir(&self) -> PathBuf {
        self.config_dir.clone()
    }

    pub fn get_daemon_path(&self) -> PathBuf {
        self.daemon_path.clone()
    }

    pub fn get_matugen_path(&self) -> PathBuf {
        self.matugen_path.clone()
    }

    pub fn get_service_path(&self) -> PathBuf {
        self.service_path.clone()
    }

    pub fn get_service_name(&self) -> String {
        self.service_name.clone()
    }

    pub fn init(&mut self) -> Result<(), String> {
        self.setup_config_dir()?;
        self.setup_daemon_path();
        self.setup_matugen_path();
        self.setup_service_routes();
        self.setup_config_path();
        self.setup_styles_path();
        Ok(())
    }

    fn setup_config_dir(&mut self) -> Result<(), String> {
        let base_dir = env::var("XDG_CONFIG_HOME")
            .map(PathBuf::from)
            .unwrap_or_else(|_| {
                let home = env::var("HOME").expect("HOME environment variable must be set");
                PathBuf::from(home).join(".config")
            });

        self.base_dir = base_dir.clone();

        println!("[INFO] Base dir: {}", base_dir.display());

        let config_dir = base_dir.join("matuda");

        self.config_dir = config_dir;

        Ok(())
    }

    pub fn create_config_dir(&self) -> Result<(), String> {
        if !self.config_dir.exists() {
            println!(
                "[INFO] Creating config folder at: {}",
                self.config_dir.display()
            );

            fs::create_dir_all(&self.config_dir)
                .map_err(|e| format!("Failed to create config directory: {}", e))?;
        }

        Ok(())
    }

    fn setup_daemon_path(&mut self) {
        let daemon_path = self.config_dir.join("daemon");
        self.daemon_path = daemon_path;
    }

    fn setup_matugen_path(&mut self) {
        let matugen_path = self.config_dir.join("matugen");
        self.matugen_path = matugen_path;
    }

    fn setup_service_routes(&mut self) {
        let service_dir = self.base_dir.join("systemd/user");
        let service_path = service_dir.join(self.service_name.clone());

        self.service_dir = service_dir;
        self.service_path = service_path;
    }

    fn setup_config_path(&mut self) {
        let config_path = self.config_dir.join("config.toml");
        self.config_path = config_path;
    }

    fn setup_styles_path(&mut self) {
        let styles_path = self.config_dir.join("matuda-template.css");
        self.styles_path = styles_path;
    }

    pub fn setup_daemon(&self, app: &AppHandle) -> Result<(), String> {
        let daemon_resource_path = app
            .path()
            .resolve("resources/daemon", BaseDirectory::Resource)
            .map_err(|_| format!("Failed to resolve daemon path"))?;

        println!(
            "[INFO] Daemon binary path: {}",
            daemon_resource_path.display()
        );
        println!(
            "[INFO] Copying daemon binary to: {}",
            self.config_dir.display()
        );

        fs::copy(&daemon_resource_path, self.daemon_path.clone())
            .map_err(|e| format!("Failed to copy the daemon: {}", e))?;

        println!("[INFO] Copied Daemon binary");

        Ok(())
    }

    pub fn setup_matugen(&self, app: &AppHandle) -> Result<(), String> {
        let matugen_resource_path = app
            .path()
            .resolve("resources/matugen", BaseDirectory::Resource)
            .map_err(|_| format!("Failed to resolve Matugen path"))?;

        println!(
            "[INFO] Matugen binary path: {}",
            matugen_resource_path.display()
        );
        println!(
            "[INFO] Copying Matugen binary to: {}",
            self.config_dir.display()
        );

        fs::copy(&matugen_resource_path, self.matugen_path.clone())
            .map_err(|e| format!("Failed to copy Matugen: {}", e))?;

        println!("Copied Matugen binary");

        Ok(())
    }

    pub fn setup_service(&self) -> Result<(), String> {
        let mut config = Ini::new();
        let exec_config = format!(
            "{} --config {} --matugen {}",
            self.daemon_path.display(),
            self.config_path.display(),
            self.matugen_path.display()
        );

        config
            .with_section(Some("Unit"))
            .set("Description", "Daemon for Matugen");
        config
            .with_section(Some("Service"))
            .set("ExecStart", exec_config)
            .set("Restart", "on-failure");
        config
            .with_section(Some("Install"))
            .set("WantedBy", "default.target");

        println!(
            "[INFO] Creating the service directory at: {}",
            self.service_dir.display()
        );

        fs::create_dir_all(self.service_dir.clone())
            .map_err(|e| format!("Failed to create directory: {}", e))?;

        println!(
            "[INFO] Creating the service at: {}",
            self.service_path.display()
        );

        config
            .write_to_file(self.service_path.clone())
            .map_err(|e| format!("Failed to write service file: {}", e))?;

        println!("Service written at: {}", self.service_path.display());

        println!("Restarting systemd");

        Command::new("systemctl")
            .arg("--user")
            .arg("daemon-reload")
            .output()
            .map_err(|e| format!("Failed to restart systemctl: {}", e))?;

        print!("Starting the service");

        Command::new("systemctl")
            .arg("--user")
            .arg("enable")
            .arg("--now")
            .arg(self.service_name.clone())
            .output()
            .map_err(|e| format!("Failed to start service: {}", e))?;

        Command::new("systemctl")
            .arg("--user")
            .arg("status")
            .arg(self.service_name.clone())
            .output()
            .map_err(|e| format!("Failed to display service: {}", e))?;

        Ok(())
    }

    pub fn setup_config(&self, config: ConfigToml) -> Result<(), String> {
        let content_config =
            toml::to_string(&config).map_err(|e| format!("Failed to serialize config: {}", e))?;

        fs::write(self.config_path.clone(), content_config)
            .map_err(|e| format!("Failed to write the config file: {}", e))?;

        println!(
            "[INFO] Config file written in: {}",
            self.config_path.display()
        );

        Ok(())
    }

    pub fn setup_template_styles(&self, app: &AppHandle) -> Result<(), String> {
        let styles_path = self.styles_path.clone();
        let styles_resource_path = app
            .path()
            .resolve("resources/matuda-template.css", BaseDirectory::Resource)
            .map_err(|_| format!("Failed to resolve Template path"))?;

        println!("[INFO] Template path: {}", styles_resource_path.display());
        println!("[INFO] Copying Template to: {}", self.config_dir.display());

        fs::copy(&styles_resource_path, &styles_path)
            .map_err(|e| format!("Failed to copy the template: {}", e))?;

        Ok(())
    }
}
