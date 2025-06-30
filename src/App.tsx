import { invoke } from '@tauri-apps/api/core';
import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import Titlebar from './components/Titlebar';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import SettingsModal from './components/SettingsModal';
import { Settings, ThemeClasses } from './types/interfaces';

// Интерфейс для тултипа
interface TooltipData {
  show: boolean;
  text: string;
  position: {
    top: number;
    left?: number;
  };
}

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [systemInfo, setSystemInfo] = useState({ os: '', version: '' });
  const [activeSettingsTab, setActiveSettingsTab] = useState('appearance');
  const [discordRpcEnabled, setDiscordRpcEnabled] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState('system');
  const [selectedTitlebarStyle, setSelectedTitlebarStyle] = useState('custom');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState<string>('en_US');
  const [availableLanguages, setAvailableLanguages] = useState<any[]>([]);
  const [translations, setTranslations] = useState<{[key: string]: string}>({});
  
  // Состояние для тултипов
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  
  // Define exact dimensions for precise calculations
  const titlebarHeight = 55;
  const sidebarWidth = 70;
  const overlapAmount = 9; // Reduced by 1px for more precise positioning
  const bottomPadding = 25; // Padding to avoid overlap at the bottom
  
  // Функция для перевода текста с использованием загруженных переводов
  const t = (key: string, defaultValue?: string): string => {
    return translations[key] || defaultValue || key;
  };
  
  // Функция для показа тултипа с задержкой
  const showTooltipWithDelay = (text: string, position: { top: number, left?: number }) => {
    const timer = setTimeout(() => {
      setTooltip({
        show: true,
        text,
        position
      });
    }, 250); // 250ms задержка
    
    return () => clearTimeout(timer);
  };
  
  // Функция для скрытия тултипа
  const hideTooltip = () => {
    setTooltip(null);
  };
  
  // Загрузка системной информации и настроек при старте
  useEffect(() => {
    const loadSystemAndSettings = async () => {
      try {
        // Start with some basic progress to indicate initialization
        setLoadingProgress(10);
        
        // Получение системной информации из Rust
        const sysInfo: any = await invoke('get_system_info');
        setSystemInfo({
          os: sysInfo.os,
          version: sysInfo.version
        });
        
        setLoadingProgress(40);
        
        // Загрузка настроек из Rust
        try {
          const settings: Settings = await invoke('get_settings');
          // Обновляем состояние из полученных настроек
          if (settings) {
            setSelectedTheme(settings.theme);
            setDiscordRpcEnabled(settings.discord_rpc);
            setCurrentLanguage(settings.language);
            // Устанавливаем стиль тайтлбара, если он есть в настройках, иначе используем 'custom' по умолчанию
            setSelectedTitlebarStyle(settings.titlebar_style || 'custom');
            
            // Apply theme immediately from the settings instead of using state
            // This ensures the correct theme is applied without waiting for React state updates
            applyTheme(settings.theme);
          }
          setLoadingProgress(70);
        } catch (e) {
          console.error('Failed to load settings:', e);
          // Используем значения по умолчанию и создаем файл настроек
          const defaultTheme = 'system';
          updateSettings({
            theme: defaultTheme,
            discord_rpc: true,
            advanced_rendering: true,
            language: 'en_US',
            titlebar_style: 'custom'
          });
          
          // Apply default theme immediately
          applyTheme(defaultTheme);
          setLoadingProgress(70);
        }
        
        // Finalize loading
        setLoadingProgress(100);
      } catch (error) {
        console.error('Failed to get system info or load settings:', error);
        // Even if there's an error, we still need to show the UI
        setLoadingProgress(100);
      }
    };
    
    loadSystemAndSettings();
  }, []);
  
  // Функция для сохранения настроек через Rust-бэкенд
  const updateSettings = async (settings: Settings) => {
    try {
      await invoke('update_settings', { settings });
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };
  
  // Обработка изменения темы
  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    updateSettings({
      theme,
      discord_rpc: discordRpcEnabled,
      advanced_rendering: true,
      language: currentLanguage,
      titlebar_style: selectedTitlebarStyle
    });
    
    // Применить тему к документу
    applyTheme(theme);
  };
  
  // Обработка переключения Discord RPC
  const handleDiscordRpcToggle = () => {
    const newValue = !discordRpcEnabled;
    setDiscordRpcEnabled(newValue);
    updateSettings({
      theme: selectedTheme,
      discord_rpc: newValue,
      advanced_rendering: true,
      language: currentLanguage,
      titlebar_style: selectedTitlebarStyle
    });
  };
  
  // Обработка изменения стиля тайтлбара
  const handleTitlebarStyleChange = (style: string) => {
    setSelectedTitlebarStyle(style);
    updateSettings({
      theme: selectedTheme,
      discord_rpc: discordRpcEnabled,
      advanced_rendering: true,
      language: currentLanguage,
      titlebar_style: style
    });
  };
  
  // Function to apply theme
  const applyTheme = (theme: string) => {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Save theme preference to localStorage for persistent experience
    localStorage.setItem('brew-theme', theme);
    
    // Add theme-specific CSS variables
    const root = document.documentElement;
    if (theme === 'dark') {
      root.style.setProperty('--bg-primary', '#0a0a0a');
      root.style.setProperty('--bg-secondary', '#18181b');
      root.style.setProperty('--bg-card', '#27272a');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#a0a0a0');
      root.style.setProperty('--border-color', '#333333');
    } else if (theme === 'light') {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f8f8f8');
      root.style.setProperty('--bg-card', '#f0f0f0');
      root.style.setProperty('--text-primary', '#000000');
      root.style.setProperty('--text-secondary', '#505050');
      root.style.setProperty('--border-color', '#e0e0e0');
    } else if (theme === 'oled') {
      root.style.setProperty('--bg-primary', '#000000');
      root.style.setProperty('--bg-secondary', '#0a0a0a');
      root.style.setProperty('--bg-card', '#111111');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#a0a0a0');
      root.style.setProperty('--border-color', '#222222');
    } else if (theme === 'system') {
      // Remove from localStorage to use system preference
      localStorage.removeItem('brew-theme');
      
      // Use system theme if available, fallback to dark
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.style.setProperty('--bg-primary', '#0a0a0a');
        root.style.setProperty('--bg-secondary', '#18181b');
        root.style.setProperty('--bg-card', '#27272a');
        root.style.setProperty('--text-primary', '#ffffff');
        root.style.setProperty('--text-secondary', '#a0a0a0');
        root.style.setProperty('--border-color', '#333333');
      } else {
        root.style.setProperty('--bg-primary', '#ffffff');
        root.style.setProperty('--bg-secondary', '#f8f8f8');
        root.style.setProperty('--bg-card', '#f0f0f0');
        root.style.setProperty('--text-primary', '#000000');
        root.style.setProperty('--text-secondary', '#505050');
        root.style.setProperty('--border-color', '#e0e0e0');
      }
    }
  };
  
  // Listen for system theme changes if system theme is selected
  useEffect(() => {
    if (selectedTheme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          // Dark mode
          const root = document.documentElement;
          root.style.setProperty('--bg-primary', '#0a0a0a');
          root.style.setProperty('--bg-secondary', '#18181b');
          root.style.setProperty('--bg-card', '#27272a');
          root.style.setProperty('--text-primary', '#ffffff');
          root.style.setProperty('--text-secondary', '#a0a0a0');
          root.style.setProperty('--border-color', '#333333');
        } else {
          // Light mode
          const root = document.documentElement;
          root.style.setProperty('--bg-primary', '#ffffff');
          root.style.setProperty('--bg-secondary', '#f8f8f8');
          root.style.setProperty('--bg-card', '#f0f0f0');
          root.style.setProperty('--text-primary', '#000000');
          root.style.setProperty('--text-secondary', '#505050');
          root.style.setProperty('--border-color', '#e0e0e0');
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [selectedTheme]);

  // Apply theme classes to main elements
  const getThemeClasses = (): ThemeClasses => {
    const themeClasses: ThemeClasses = {
      background: 'bg-[var(--bg-primary)]',
      secondaryBackground: 'bg-[var(--bg-secondary)]',
      cardBackground: 'bg-[var(--bg-card)]',
      text: 'text-[var(--text-primary)]',
      secondaryText: 'text-[var(--text-secondary)]',
      border: 'border-[var(--border-color)]'
    };
    
    return themeClasses;
  };
  
  const themeClasses = getThemeClasses();
  
  // Show splash screen while loading
  if (isLoading) {
    return <SplashScreen 
      onInitialized={() => setIsLoading(false)}
      progress={loadingProgress}
      onLanguageLoaded={(loadedTranslations) => setTranslations(loadedTranslations)}
    />;
  }

  return (
    <div className={`flex h-screen w-screen ${themeClasses.background} overflow-hidden relative fade-in`}>
      {/* Titlebar Component */}
      <Titlebar
        selectedTitlebarStyle={selectedTitlebarStyle}
        t={t}
        themeClasses={themeClasses}
      />

      {/* Layout Container */}
      <div className="flex w-full h-full">
        {/* Sidebar Component */}
        <Sidebar
          themeClasses={themeClasses}
          titlebarHeight={titlebarHeight}
          overlapAmount={overlapAmount}
          bottomPadding={bottomPadding}
          onSettingsClick={() => setShowSettings(true)}
          t={t}
          showTooltip={(text, position) => showTooltipWithDelay(text, position)}
          hideTooltip={hideTooltip}
        />

        {/* Main Content Component */}
        <MainContent
          themeClasses={themeClasses}
          titlebarHeight={titlebarHeight}
          sidebarWidth={sidebarWidth}
          overlapAmount={overlapAmount}
          tooltip={tooltip}
          selectedTheme={selectedTheme}
        />
      </div>
      
      {/* Settings Modal Component */}
      <SettingsModal
        themeClasses={themeClasses}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        activeSettingsTab={activeSettingsTab}
        setActiveSettingsTab={setActiveSettingsTab}
        systemInfo={systemInfo}
        selectedTheme={selectedTheme}
        selectedTitlebarStyle={selectedTitlebarStyle}
        handleThemeChange={handleThemeChange}
        handleTitlebarStyleChange={handleTitlebarStyleChange}
        t={t}
      />
    </div>
  );
}

export default App;
