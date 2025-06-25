// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::fs;
use std::path::{Path, PathBuf};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::{AppHandle, Manager, State};
use std::error::Error;
use std::fs::create_dir_all;

// Define settings structure
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Settings {
    pub theme: String,
    pub discord_rpc: bool,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            theme: "system".to_string(),
            discord_rpc: true,
        }
    }
}

// Struct to hold application state
struct AppState {
    settings: Mutex<Settings>,
    settings_path: Mutex<Option<PathBuf>>,
}

// Function to get the settings directory path based on OS
fn get_settings_path(_app_handle: &AppHandle) -> Result<PathBuf, Box<dyn Error>> {
    let mut path = if cfg!(target_os = "linux") {
        // Linux: ~/.brew-app
        let home = dirs::home_dir()
            .ok_or_else(|| "Could not find home directory")?;
        home.join(".brew-app")
    } else if cfg!(target_os = "macos") {
        // macOS: ~/Library/Application Support/brew-app
        let home = dirs::home_dir()
            .ok_or_else(|| "Could not find home directory")?;
        home.join("Library/Application Support/brew-app")
    } else {
        // Windows or fallback
        let home = dirs::config_dir()
            .ok_or_else(|| "Could not find config directory")?;
        home.join("brew-app")
    };

    // Create directory if it doesn't exist
    if !path.exists() {
        create_dir_all(&path)?;
    }
    
    path = path.join("settings.json");
    Ok(path)
}

// Load settings from file
fn load_settings(path: &Path) -> Result<Settings, Box<dyn Error>> {
    if path.exists() {
        let contents = fs::read_to_string(path)?;
        let settings = serde_json::from_str(&contents)?;
        Ok(settings)
    } else {
        Ok(Settings::default())
    }
}

// Save settings to file
fn save_settings(settings: &Settings, path: &Path) -> Result<(), Box<dyn Error>> {
    let json = serde_json::to_string_pretty(&settings)?;
    
    // Ensure parent directory exists
    if let Some(parent) = path.parent() {
        if !parent.exists() {
            create_dir_all(parent)?;
        }
    }
    
    fs::write(path, json)?;
    Ok(())
}

// Command to get current settings
#[tauri::command]
async fn get_settings(app_handle: AppHandle, state: State<'_, AppState>) -> Result<Settings, String> {
    let mut settings_path_guard = state.settings_path.lock().unwrap();
    
    if settings_path_guard.is_none() {
        // Initialize settings path if it's not set yet
        let path = get_settings_path(&app_handle).map_err(|e| e.to_string())?;
        *settings_path_guard = Some(path);
    }
    
    // Return current settings from state
    let settings = state.settings.lock().unwrap().clone();
    Ok(settings)
}

// Command to update settings
#[tauri::command]
async fn update_settings(
    settings: Settings,
    app_handle: AppHandle,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let mut settings_path_guard = state.settings_path.lock().unwrap();
    
    if settings_path_guard.is_none() {
        // Initialize settings path if it's not set yet
        let path = get_settings_path(&app_handle).map_err(|e| e.to_string())?;
        *settings_path_guard = Some(path);
    }
    
    // Update state with new settings
    *state.settings.lock().unwrap() = settings.clone();
    
    // Save updated settings to file
    if let Some(path) = &*settings_path_guard {
        save_settings(&settings, path).map_err(|e| e.to_string())?;
    }
    
    Ok(())
}

// Command to get system information
#[tauri::command]
fn get_system_info() -> Result<serde_json::Value, String> {
    let os_type = std::env::consts::OS;
    
    // Properly access os_info version without directly accessing private fields
    let os_info = os_info::get();
    let os_version = format!("{}", os_info.version());

    let system_info = serde_json::json!({
        "os": os_type,
        "version": os_version
    });

    Ok(system_info)
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // Initialize app state
            let app_handle = app.handle();
            let settings_path = get_settings_path(&app_handle).ok();
            
            let settings = if let Some(ref path) = settings_path {
                load_settings(path).unwrap_or_default()
            } else {
                Settings::default()
            };
            
            app.manage(AppState {
                settings: Mutex::new(settings),
                settings_path: Mutex::new(settings_path),
            });
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            get_settings,
            update_settings,
            get_system_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
