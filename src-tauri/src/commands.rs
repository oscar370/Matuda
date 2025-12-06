use std::{fs, process::Command};
use tauri::{AppHandle, State};

use crate::appmanager::{ConfigToml, Daemon};

#[tauri::command]
pub fn get_service_status(daemon: State<Daemon>) -> Result<String, String> {
    let output = Command::new("systemctl")
        .arg("--user")
        .arg("status")
        .arg(daemon.get_service_name())
        .output()
        .map_err(|e| format!("Failed to invoke the command: {}", e))?;
    let stdout = String::from_utf8_lossy(&output.stdout).to_string();
    Ok(stdout)
}

#[tauri::command]
pub fn is_service_installed(daemon: State<Daemon>) -> bool {
    let daemon_path = daemon.get_daemon_path();
    let matugen_path = daemon.get_matugen_path();
    let service_path = daemon.get_service_path();

    if !daemon_path.exists() {
        return false;
    }

    if !matugen_path.exists() {
        return false;
    }

    if !service_path.exists() {
        return false;
    }

    true
}

#[tauri::command]
pub fn init_app(
    daemon: State<Daemon>,
    app: AppHandle,
    invoke_config: ConfigToml,
) -> Result<(), String> {
    daemon.create_config_dir().map_err(|e| format!("{}", e))?;

    daemon.setup_daemon(&app).map_err(|e| format!("{}", e))?;

    daemon.setup_matugen(&app).map_err(|e| format!("{}", e))?;

    daemon.setup_service().map_err(|e| format!("{}", e))?;

    daemon
        .setup_config(invoke_config)
        .map_err(|e| format!("{}", e))?;

    daemon
        .setup_template_styles(&app)
        .map_err(|e| format!("{}", e))?;

    Ok(())
}

#[tauri::command]
pub fn start_service(daemon: State<Daemon>) -> Result<(), String> {
    let service_name = daemon.get_service_name();

    Command::new("systemctl")
        .arg("--user")
        .arg("enable")
        .arg("--now")
        .arg(&service_name)
        .output()
        .map_err(|e| format!("Failed to invoke the command: {}", e))?;

    Ok(())
}

#[tauri::command]
pub fn restart_service(daemon: State<Daemon>) -> Result<(), String> {
    Command::new("systemctl")
        .arg("--user")
        .arg("restart")
        .arg(daemon.get_service_name())
        .output()
        .map_err(|e| format!("Failed to invoke the command: {}", e))?;

    Ok(())
}

#[tauri::command]
pub fn stop_service(daemon: State<Daemon>) -> Result<(), String> {
    let service_name = daemon.get_service_name();

    Command::new("systemctl")
        .arg("--user")
        .arg("disable")
        .arg("--now")
        .arg(&service_name)
        .output()
        .map_err(|e| format!("Failed to invoke the command: {}", e))?;

    Ok(())
}

#[tauri::command]
pub fn clean_service(daemon: State<Daemon>) -> Result<(), String> {
    let service_path = daemon.get_service_path();

    stop_service(daemon).map_err(|e| format!("{}", e))?;

    fs::remove_file(service_path).map_err(|e| format!("Failed to remove file in: {}", e))?;

    Ok(())
}

#[tauri::command]
pub fn clean_app(daemon: State<Daemon>) -> Result<(), String> {
    let config_dir = daemon.get_config_dir();
    clean_service(daemon).map_err(|e| format!("{}", e))?;

    fs::remove_dir_all(config_dir).map_err(|e| format!("Failed to remove directory: {}", e))?;

    Ok(())
}

#[tauri::command]
pub fn setup_config(invoke_config: ConfigToml, daemon: State<Daemon>) -> Result<(), String> {
    daemon
        .setup_config(invoke_config)
        .map_err(|e| format!("Failed to setup config file : {}", e))?;

    Ok(())
}

#[tauri::command]
pub fn load_styles(daemon: State<Daemon>) -> Result<String, String> {
    let styles_path = daemon.get_config_dir().join("matuda.css");

    if !styles_path.exists() {
        return Err("The style sheet was not found".into());
    }

    let styles = fs::read_to_string(&styles_path)
        .map_err(|e| format!("Failed to read the style sheet {}", e))?;

    Ok(styles)
}
