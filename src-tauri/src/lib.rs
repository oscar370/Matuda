mod appmanager;
mod commands;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::get_service_status,
            commands::is_service_installed,
            commands::init_app,
            commands::start_service,
            commands::restart_service,
            commands::stop_service,
            commands::clean_service,
            commands::clean_app,
            commands::setup_config,
            commands::load_styles,
            commands::reinstall_binaries_service,
        ])
        .setup(|app| {
            let mut daemon = appmanager::Daemon::new();

            if let Err(e) = daemon.init() {
                eprintln!("[ERROR] {}", e);
            }

            app.manage(daemon);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
