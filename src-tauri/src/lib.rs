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
    pub advanced_rendering: bool,
    pub language: String,
    pub titlebar_style: String,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            theme: "system".to_string(),
            discord_rpc: true,
            advanced_rendering: true,
            language: "en_US".to_string(),
            titlebar_style: "custom".to_string(),
        }
    }
}

// Define language metadata structure
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LanguageMetadata {
    pub id: String,
    pub version: String,
    pub author: String,
}

// Define complete language structure
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Language {
    // Metadata
    pub metadata: LanguageMetadata,
    // Translations (dynamic key-value pairs)
    #[serde(flatten)]
    pub translations: std::collections::HashMap<String, String>,
}

// Struct to hold application state
struct AppState {
    settings: Mutex<Settings>,
    settings_path: Mutex<Option<PathBuf>>,
    current_language: Mutex<Language>,
}

// Function to get the settings directory path based on OS
fn get_settings_path(_app_handle: &AppHandle) -> Result<PathBuf, Box<dyn Error>> {
    let path = if cfg!(target_os = "linux") {
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
    
    Ok(path)
}

// Get path to settings.json
fn get_settings_file_path(app_handle: &AppHandle) -> Result<PathBuf, Box<dyn Error>> {
    let path = get_settings_path(app_handle)?;
    Ok(path.join("settings.json"))
}

// Get path to languages directory
fn get_languages_path(app_handle: &AppHandle) -> Result<PathBuf, Box<dyn Error>> {
    let path = get_settings_path(app_handle)?;
    let languages_path = path.join("languages");
    
    // Create languages directory if it doesn't exist
    if !languages_path.exists() {
        create_dir_all(&languages_path)?;
    }
    
    Ok(languages_path)
}

// Get path to a specific language file
fn get_language_file_path(app_handle: &AppHandle, lang_code: &str) -> Result<PathBuf, Box<dyn Error>> {
    let languages_path = get_languages_path(app_handle)?;
    Ok(languages_path.join(format!("{}.json", lang_code)))
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

// Create default language files if they don't exist
fn ensure_language_files_exist(app_handle: &AppHandle) -> Result<(), Box<dyn Error>> {
    // Get languages directory path
    let languages_path = get_languages_path(app_handle)?;
    
    // Tauri v2 approach to get resource directory
    let resource_dir = match app_handle.app_handle().path().resource_dir() {
        Ok(dir) => dir,
        Err(e) => {
            eprintln!("Could not find resource directory: {}", e);
            return Ok(());  // Continue without copying language files
        }
    };
    
    // Create the full path to the languages directory in resources
    let resource_languages_dir = resource_dir.join("languages");
    
    // Check if the resource languages directory exists
    if resource_languages_dir.exists() && resource_languages_dir.is_dir() {
        // Read all files from the resource languages directory
        if let Ok(entries) = fs::read_dir(&resource_languages_dir) {
            for entry in entries {
                if let Ok(entry) = entry {
                    let source_path = entry.path();
                    
                    // Only process JSON files
                    if let Some(extension) = source_path.extension() {
                        if extension == "json" {
                            if let Some(filename) = source_path.file_name() {
                                let dest_path = languages_path.join(filename);
                                
                                // Copy file if it doesn't exist in the destination
                                if !dest_path.exists() {
                                    // Try to read and copy the file
                                    if let Ok(content) = fs::read_to_string(&source_path) {
                                        fs::write(&dest_path, content)?;
                                        println!("Copied language file: {:?}", dest_path);
                                    } else {
                                        eprintln!("Failed to read language file: {:?}", source_path);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            eprintln!("Could not read from languages resource directory");
        }
    } else {
        eprintln!("Languages resource directory not found: {:?}", resource_languages_dir);
    }
    
    Ok(())
}

// Load language from file
fn load_language(app_handle: &AppHandle, lang_code: &str) -> Result<Language, Box<dyn Error>> {
    let lang_path = get_language_file_path(app_handle, lang_code)?;
    
    if lang_path.exists() {
        let contents = fs::read_to_string(lang_path)?;
        match serde_json::from_str(&contents) {
            Ok(language) => Ok(language),
            Err(e) => {
                eprintln!("Error parsing language file {}: {}", lang_code, e);
                create_default_language()
            }
        }
    } else {
        // If the requested language doesn't exist and it's not already English,
        // fall back to English
        if lang_code != "en_US" {
            eprintln!("Language {} not found, falling back to en_US", lang_code);
            load_language(app_handle, "en_US")
        } else {
            // If even English doesn't exist, create a default language instance
            eprintln!("Default language (en_US) not found, using built-in defaults");
            create_default_language()
        }
    }
}

// Create a default language instance with basic English translations
fn create_default_language() -> Result<Language, Box<dyn Error>> {
    Ok(Language {
        metadata: LanguageMetadata {
            id: "en_US".to_string(),
            version: "1.0.0".to_string(),
            author: "brew team".to_string(),
        },
        translations: [
            ("app.title".to_string(), "brew".to_string()),
            ("app.status.no_instances".to_string(), "No instances running".to_string()),
            ("settings.title".to_string(), "Settings".to_string()),
            ("settings.tab.appearance".to_string(), "Appearance".to_string()),
            ("settings.tab.privacy".to_string(), "Privacy".to_string()),
            ("settings.appearance.color_theme".to_string(), "Color theme".to_string()),
            ("settings.appearance.color_theme.description".to_string(), "Select your preferred color theme for Modrinth App.".to_string()),
            ("settings.appearance.theme.dark".to_string(), "Dark".to_string()),
            ("settings.appearance.theme.light".to_string(), "Light".to_string()),
            ("settings.appearance.theme.oled".to_string(), "OLED".to_string()),
            ("settings.appearance.theme.sync".to_string(), "Sync".to_string()),
            ("settings.privacy.discord_rpc".to_string(), "Discord RPC".to_string()),
            ("settings.privacy.discord_rpc.description".to_string(), "Manages the Discord Rich Presence integration. Disabling this will cause 'Modrinth' to no longer show up as a game or app you are using on your Discord profile.".to_string()),
            ("settings.privacy.discord_rpc.note".to_string(), "Note: This will not prevent any instance-specific Discord Rich Presence integrations, such as those added by mods. (app restart required to take effect)".to_string()),
            // New translations for titlebar styles <brew app v0.0.5>
            ("settings.appearance.titlebar_style".to_string(), "Titlebar Style".to_string()),
            ("settings.appearance.titlebar_style.description".to_string(), "Choose how the application window titlebar should look.".to_string()),
            ("settings.appearance.titlebar.custom".to_string(), "Custom".to_string()),
            ("settings.appearance.titlebar.native".to_string(), "Native".to_string()),
            ("settings.appearance.titlebar.macos".to_string(), "macOS".to_string()),
            ("settings.appearance.titlebar.note".to_string(), "Note: Changing the titlebar style requires restarting the application.".to_string()),
            ("settings.appearance.titlebar.restart_required".to_string(), "The application needs to be restarted to apply the titlebar style change.".to_string()),
        ].iter().cloned().collect(),
    })
}

// Command to get available languages
#[tauri::command]
async fn get_available_languages(app_handle: AppHandle) -> Result<Vec<LanguageMetadata>, String> {
    // Get languages directory
    let languages_path = get_languages_path(&app_handle).map_err(|e| e.to_string())?;
    
    // Read directory and find language files
    let mut languages = Vec::new();
    
    // Read from user languages directory first
    if let Ok(entries) = fs::read_dir(&languages_path) {
        for entry in entries {
            if let Ok(entry) = entry {
                let path = entry.path();
                if let Some(ext) = path.extension() {
                    if ext == "json" {
                        if let Ok(content) = fs::read_to_string(&path) {
                            match serde_json::from_str::<Language>(&content) {
                                Ok(language) => {
                                    languages.push(language.metadata);
                                },
                                Err(e) => {
                                    eprintln!("Error parsing language file {:?}: {}", path, e);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    // If no languages found, check the resources directory
    if languages.is_empty() {
        // In Tauri v2, resource_dir() returns Result<PathBuf, Error> instead of Option<PathBuf>
        match app_handle.path().resource_dir() {
            Ok(resource_dir) => {
                let resource_languages_dir = resource_dir.join("languages");
                
                if resource_languages_dir.exists() && resource_languages_dir.is_dir() {
                    if let Ok(entries) = fs::read_dir(&resource_languages_dir) {
                        for entry in entries {
                            if let Ok(entry) = entry {
                                let path = entry.path();
                                if let Some(ext) = path.extension() {
                                    if ext == "json" {
                                        if let Ok(content) = fs::read_to_string(&path) {
                                            match serde_json::from_str::<Language>(&content) {
                                                Ok(language) => {
                                                    languages.push(language.metadata);
                                                },
                                                Err(e) => {
                                                    eprintln!("Error parsing language file {:?}: {}", path, e);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            Err(e) => {
                eprintln!("Error getting resource directory: {}", e);
            }
        }
    }
    
    // Ensure we have at least one language
    if languages.is_empty() {
        // Create a default English metadata if no languages found
        languages.push(LanguageMetadata {
            id: "en_US".to_string(),
            version: "1.0.0".to_string(),
            author: "brew team".to_string(),
        });
    }
    
    Ok(languages)
}

// Command to get translations for current language
#[tauri::command]
async fn get_translations(_app_handle: AppHandle, state: State<'_, AppState>) -> Result<Language, String> {
    // Return current language from state
    let current_language = state.current_language.lock().unwrap().clone();
    Ok(current_language)
}

// Command to change language
#[tauri::command]
async fn change_language(lang_code: String, app_handle: AppHandle, state: State<'_, AppState>) -> Result<Language, String> {
    // Load the requested language
    let language = load_language(&app_handle, &lang_code).map_err(|e| e.to_string())?;
    
    // Update current language in state
    *state.current_language.lock().unwrap() = language.clone();
    
    // Update language in settings
    let mut settings = state.settings.lock().unwrap().clone();
    settings.language = lang_code;
    
    // Save settings to file
    if let Some(path) = &*state.settings_path.lock().unwrap() {
        save_settings(&settings, path).map_err(|e| e.to_string())?;
    }
    
    // Update settings in state
    *state.settings.lock().unwrap() = settings;
    
    Ok(language)
}

// Command to get current settings
#[tauri::command]
async fn get_settings(app_handle: AppHandle, state: State<'_, AppState>) -> Result<Settings, String> {
    let mut settings_path_guard = state.settings_path.lock().unwrap();
    
    if settings_path_guard.is_none() {
        // Initialize settings path if it's not set yet
        let path = get_settings_file_path(&app_handle).map_err(|e| e.to_string())?;
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
    // Update settings in state
    {
        let mut current_settings = state.settings.lock().map_err(|_| "Failed to lock settings")?;
        
        // Check if titlebar style has changed
        let titlebar_style_changed = current_settings.titlebar_style != settings.titlebar_style;
        
        // Update settings
        *current_settings = settings.clone();
        
        // Save settings to file
        if let Some(path) = &*state.settings_path.lock().map_err(|_| "Failed to lock settings path")? {
            save_settings(&settings, path).map_err(|e| format!("Failed to save settings: {}", e))?;
        }
        
        // If language changed, update the current language
        if current_settings.language != settings.language {
            let new_language = load_language(&app_handle, &settings.language)
                .map_err(|e| format!("Failed to load language: {}", e))?;
            
            let mut current_language = state.current_language.lock()
                .map_err(|_| "Failed to lock current language")?;
            *current_language = new_language;
        }
        
        // If titlebar style changed, inform the user they need to restart
        if titlebar_style_changed {
            println!("Titlebar style changed to: {}", settings.titlebar_style);
            // Note: The actual change will be applied on next app restart
        }
    }
    
    Ok(())
}

// Command to get system information
#[tauri::command]
fn get_system_info() -> Result<serde_json::Value, String> {
    let os_info = os_info::get();
    
    // Correctly determine the OS type, taking into account the macOS specifics
    let os_type = match os_info.os_type() {
        os_info::Type::Macos => "macOS",
        _ => std::env::consts::OS
    };
    
    // Get the OS version
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

// Function to apply titlebar style to window
fn apply_titlebar_style(app: &tauri::App) -> Result<(), Box<dyn Error>> {
    // Get the main window
    let window = app.get_webview_window("main").ok_or("Failed to get main window")?;
    
    // Get settings
    let state = app.state::<AppState>();
    let settings = state.settings.lock().map_err(|_| "Failed to lock settings")?;
    
    // Apply titlebar style based on settings
    match settings.titlebar_style.as_str() {
        "native" => {
            // Enable native decorations
            window.set_decorations(true)?;
        },
        "custom" | "macos" => {
            // Disable native decorations for custom titlebar
            window.set_decorations(false)?;
        },
        _ => {
            // Default to custom titlebar
            window.set_decorations(false)?;
        }
    }
    
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // Initialize settings path
            let settings_path = get_settings_file_path(&app.app_handle())?;
            
            // Load or create settings
            let settings = if settings_path.exists() {
                load_settings(&settings_path)?
            } else {
                let default_settings = Settings::default();
                save_settings(&default_settings, &settings_path)?;
                default_settings
            };
            
            // Ensure language files exist
            ensure_language_files_exist(&app.app_handle())?;
            
            // Load current language
            let current_language = load_language(&app.app_handle(), &settings.language)?;
            
            // Create app state
            app.manage(AppState {
                settings: Mutex::new(settings),
                settings_path: Mutex::new(Some(settings_path)),
                current_language: Mutex::new(current_language),
            });
            
            // Apply titlebar style based on settings
            apply_titlebar_style(app)?;
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            get_system_info,
            get_settings,
            update_settings,
            get_available_languages,
            get_translations,
            change_language,
        ])
        .build(tauri::generate_context!())
        .expect("error while running tauri application");
        
    app.run(|_app_handle, event| {
        match event {
            tauri::RunEvent::ExitRequested { api, .. } => {
                api.prevent_exit();
            }
            _ => {}
        }
    });
}
