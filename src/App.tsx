import { Window } from '@tauri-apps/api/window';
import { invoke } from '@tauri-apps/api/core';
import { useState, useEffect } from 'react';
import appIcon from './assets/beer.svg';
import SplashScreen from './components/SplashScreen';

// Определение типа настроек для TypeScript
interface Settings {
  theme: string;
  discord_rpc: boolean;
}

function App() {
  const appWindow = Window.getCurrent();
  const [showSettings, setShowSettings] = useState(false);
  const [systemInfo, setSystemInfo] = useState({ os: '', version: '' });
  const [activeSettingsTab, setActiveSettingsTab] = useState('appearance');
  const [discordRpcEnabled, setDiscordRpcEnabled] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState('system');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
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
          }
          setLoadingProgress(70);
        } catch (e) {
          console.error('Failed to load settings:', e);
          // Используем значения по умолчанию и создаем файл настроек
          updateSettings({
            theme: 'system',
            discord_rpc: true
          });
          setLoadingProgress(70);
        }
        
        // Apply theme before showing the main UI
        applyTheme(selectedTheme);
        
        // Finalize loading
        setLoadingProgress(100);
        
        // Delay showing the main UI to complete the splash screen animation
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Failed to get system info or load settings:', error);
        // Even if there's an error, we still need to show the UI
        setLoadingProgress(100);
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
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
      discord_rpc: discordRpcEnabled
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
      discord_rpc: newValue
    });
  };
  
  // Function to apply theme
  const applyTheme = (theme: string) => {
    document.documentElement.setAttribute('data-theme', theme);
    
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
  
  // Define exact dimensions for precise calculations
  const titlebarHeight = 55;
  const sidebarWidth = 70;
  const overlapAmount = 9; // Reduced by 1px for more precise positioning
  const bottomPadding = 25; // Padding to avoid overlap at the bottom
  
  // Calculate settings button position
  const buttonSize = 48; // w-12 = 48px (12 * 4px in Tailwind)
  const visibleSidebarWidth = sidebarWidth - overlapAmount; // 61px
  const buttonLeftPosition = (visibleSidebarWidth - buttonSize) / 2; // Center in visible area

  // Apply theme classes to main elements
  const getThemeClasses = () => {
    const themeClasses = {
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
    />;
  }

  return (
    <div className={`flex h-screen w-screen ${themeClasses.background} overflow-hidden relative fade-in`}>
      {/* Titlebar - height 55px */}
      <div 
        className={`w-full h-[55px] ${themeClasses.secondaryBackground} fixed top-0 left-0 right-0 flex items-center justify-between border-b ${themeClasses.border} z-10`}
        data-tauri-drag-region
      >
        {/* Left side with logo - adjusted to avoid overlap */}
        <div className="flex items-center h-full pl-0 z-20 relative top-[-4px]" data-tauri-drag-region>
          <span className={`${themeClasses.text} font-medium text-2xl tracking-tight ml-16 antialiased`} data-tauri-drag-region>brew</span>
        </div>
        
        {/* App icon at the intersection */}
        <div className="absolute left-[16px] top-[7px] z-30">
          <img src={appIcon} alt="App Icon" className="w-9 h-9" />
        </div>
        
        {/* Right side with status indicator and window controls - adjusted to avoid overlap */}
        <div className="flex items-center h-full relative top-[-4px]" data-tauri-drag-region>
          {/* Status indicator with border and rounded corners */}
          <div className={`flex items-center border ${themeClasses.border} rounded-full px-3 py-1 mr-2 ${themeClasses.secondaryBackground}`} data-tauri-drag-region>
            <span className="w-2 h-2 rounded-full bg-gray-400 mr-2" data-tauri-drag-region></span>
            <span className={`text-sm ${themeClasses.secondaryText} antialiased`} data-tauri-drag-region>No instances running</span>
          </div>
          
          {/* Window controls with subtle hover effects and smoother transitions */}
          <div className="flex no-drag">
            <button 
              className={`w-10 h-10 flex items-center justify-center hover:bg-[var(--bg-card)] active:scale-95 active:translate-y-[1px] ${themeClasses.secondaryText} rounded-full mx-1 transition-all no-drag`}
              onClick={() => appWindow.minimize()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <button 
              className={`w-10 h-10 flex items-center justify-center hover:bg-[var(--bg-card)] active:scale-95 active:translate-y-[1px] ${themeClasses.secondaryText} rounded-full mx-1 transition-all no-drag`}
              onClick={() => appWindow.toggleMaximize()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              </svg>
            </button>
            <button 
              className="w-10 h-10 flex items-center justify-center hover:bg-[#ff0000] active:scale-95 active:translate-y-[1px] active:bg-[#cc0000] text-gray-400 hover:text-white rounded-full mx-1 transition-all no-drag"
              onClick={() => appWindow.close()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Layout Container */}
      <div className="flex w-full h-full">
        {/* Sidebar - width 70px - no border and lower than titlebar */}
        <aside 
          className={`w-[70px] h-full ${themeClasses.secondaryBackground} pt-[55px] z-10 flex flex-col`}
          style={{ 
            height: `calc(100vh - ${titlebarHeight - overlapAmount}px)`, 
            marginTop: `${titlebarHeight - overlapAmount}px`,
            paddingBottom: `${bottomPadding}px`
          }}
        >
          {/* Top section for menu items (if any in the future) */}
          <div className="flex-grow"></div>
          
          {/* Settings button - positioned with mathematical calculation */}
          <div className="w-full flex mb-12 relative">
            <button 
              className={`w-12 h-12 flex items-center justify-center hover:bg-[var(--bg-card)] hover:shadow-md active:scale-95 active:translate-y-[1px] ${themeClasses.secondaryText} hover:${themeClasses.text} rounded-full transition-all absolute`}
              style={{ left: `${buttonLeftPosition}px` }}
              onClick={() => setShowSettings(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                strokeWidth="1.5" viewBox="0 0 24 24" className="w-7 h-7">
                <circle cx="12" cy="12" r="3" />
                <path
                  d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
            </button>
          </div>
        </aside>

        {/* Main container with rounded top-left corner overlapping titlebar and sidebar */}
        <div 
          className="absolute z-20"
          style={{ 
            top: `${titlebarHeight - overlapAmount}px`, 
            left: `${sidebarWidth - overlapAmount}px`,
            right: '0',
            bottom: '0'
          }}
        >
          <main
            className={`w-full h-full ${themeClasses.background} rounded-tl-[24px] p-4 ${themeClasses.text} overflow-auto border-t border-l ${themeClasses.border}`}
            style={{
              boxShadow: 'inset 0 4px 8px -2px rgba(0,0,0,0.10), inset 4px 0 8px -2px rgba(0,0,0,0.10)'
            }}
          >
          </main>
        </div>
      </div>
      
      {/* Settings Modal */}
      {showSettings && (
        <>
          {/* Backdrop with blur effect with strong filters to ensure blur works */}
          <div 
            className="fixed inset-0 z-40"
            style={{
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              backgroundColor: 'rgba(20, 17, 0, 0.55)'
            }}
            onClick={() => setShowSettings(false)}
          ></div>
          
          {/* Modal Content */}
          <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[550px] ${themeClasses.secondaryBackground} rounded-2xl shadow-xl z-50 overflow-hidden border ${themeClasses.border} flex flex-col`}>
            {/* Modal Titlebar */}
            <div className={`h-[60px] w-full ${themeClasses.secondaryBackground} px-4 flex items-center justify-between border-b ${themeClasses.border}`}>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth="1.5" viewBox="0 0 24 24" className={`${themeClasses.secondaryText} mr-3`}>
                  <circle cx="12" cy="12" r="3" />
                  <path
                    d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                </svg>
                <h2 className={`text-xl font-medium ${themeClasses.text}`}>Settings</h2>
              </div>
              
              {/* Close button */}
              <button 
                className={`w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--bg-card)] transition-colors ${themeClasses.secondaryText} hover:${themeClasses.text}`}
                onClick={() => setShowSettings(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            {/* Modal Content Area */}
            <div className={`flex flex-1 ${themeClasses.secondaryBackground}`}>
              {/* Left sidebar with settings options */}
              <div className="w-[260px] h-full flex flex-col">
                {/* Settings options buttons */}
                <div className="flex-1 overflow-y-auto pt-10 px-4">
                  {/* Appearance button with theme-adaptive active effect */}
                  <button
                    className={`w-full py-1 px-4 mb-2 text-left rounded-xl flex items-center transition-all
                      ${activeSettingsTab === 'appearance' 
                        ? 'text-[#ffcc40] shadow-inner border' 
                        : `${themeClasses.secondaryText} hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]`
                      }
                      active:scale-[0.98] active:translate-y-[1px] focus:outline-none
                    `}
                    style={{
                      backgroundColor: activeSettingsTab === 'appearance' ? 'rgba(255, 204, 64, 0.15)' : '',
                      borderColor: activeSettingsTab === 'appearance' ? 'rgba(255, 204, 64, 0.3)' : ''
                    }}
                    onClick={() => setActiveSettingsTab('appearance')}
                  >
                    {/* Inline SVG for paintbrush to control color */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
                      stroke={activeSettingsTab === 'appearance' ? "#ffcc40" : "currentColor"} 
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                      <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z"></path>
                      <path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7"></path>
                      <path d="M14.5 17.5 4.5 15"></path>
                    </svg>
                    <span className="font-bold">Appearance</span>
                  </button>

                  {/* Privacy button */}
                  <button
                    className={`w-full py-1 px-4 mb-2 text-left rounded-xl flex items-center transition-all
                      ${activeSettingsTab === 'privacy' 
                        ? 'text-[#ffcc40] shadow-inner border' 
                        : `${themeClasses.secondaryText} hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]`
                      }
                      active:scale-[0.98] active:translate-y-[1px] focus:outline-none
                    `}
                    style={{
                      backgroundColor: activeSettingsTab === 'privacy' ? 'rgba(255, 204, 64, 0.15)' : '',
                      borderColor: activeSettingsTab === 'privacy' ? 'rgba(255, 204, 64, 0.3)' : ''
                    }}
                    onClick={() => setActiveSettingsTab('privacy')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
                      stroke={activeSettingsTab === 'privacy' ? "#ffcc40" : "currentColor"} 
                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    <span className="font-bold">Privacy</span>
                  </button>
                </div>
                
                {/* App Info - no top border */}
                <div className="p-5 flex items-center">
                  <div className="flex items-center">
                    <img src={appIcon} alt="App Icon" className="w-8 h-8 mr-3" />
                    <div>
                      <p className={`${themeClasses.secondaryText} text-sm font-medium`}>brew App 0.0.4</p>
                      <p className={`${themeClasses.secondaryText} text-xs`}>Linux {systemInfo.version}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Content Area */}
              <div className={`flex-1 ${themeClasses.secondaryBackground} relative`}>
                {/* Vertical separator line - делаем более заметным */}
                <div className={`absolute left-0 top-[8%] bottom-[8%] w-[2px] bg-[var(--border-color)] opacity-70`}></div>
                
                {/* Content for the active tab */}
                <div className="p-6 h-full">
                  {activeSettingsTab === 'appearance' && (
                    <div>
                      <h3 className={`text-xl ${themeClasses.text} font-medium mb-2`}>Color theme</h3>
                      <p className={`${themeClasses.secondaryText} text-sm mb-5`}>Select your preferred color theme for Modrinth App.</p>
                      
                      {/* Theme selector grid - restored original size */}
                      <div className="grid grid-cols-2 gap-4 max-w-md">
                        {/* Dark theme */}
                        <div 
                          className={`bg-[#141414] rounded-2xl p-1 cursor-pointer border ${selectedTheme === 'dark' ? 'border-gray-500' : 'border-[#232323]'}`}
                          onClick={() => handleThemeChange('dark')}
                        >
                          {/* Improved preview with card UI */}
                          <div className="bg-[#18181b] p-4 rounded-2xl mb-0 h-[100px] relative overflow-hidden">
                            {/* Card UI on dark background */}
                            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 h-3/5 bg-[#27272a] rounded-md shadow-md flex flex-col justify-center items-center">
                              <div className="h-2 w-1/2 bg-[#3a3a3f] rounded-sm mb-1.5"></div>
                              <div className="h-2 w-2/3 bg-[#3a3a3f] rounded-sm"></div>
                            </div>
                          </div>
                          
                          <div className="flex items-center px-2 py-2">
                            <div className={`w-4 h-4 rounded-full border ${selectedTheme === 'dark' ? 'border-[#ffcc40]' : 'border-gray-500'} flex items-center justify-center mr-2`}>
                              {selectedTheme === 'dark' && (
                                <div className="w-2 h-2 rounded-full bg-[#ffcc40]"></div>
                              )}
                            </div>
                            <span className="text-gray-300 mr-1">Dark</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                            </svg>
                          </div>
                        </div>
                        
                        {/* Light theme */}
                        <div 
                          className={`bg-[#141414] rounded-2xl p-1 cursor-pointer border ${selectedTheme === 'light' ? 'border-gray-500' : 'border-[#232323]'}`}
                          onClick={() => handleThemeChange('light')}
                        >
                          {/* Improved preview with card UI */}
                          <div className="bg-[#f8f8f8] p-4 rounded-2xl mb-0 h-[100px] relative overflow-hidden">
                            {/* Card UI on light background */}
                            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 h-3/5 bg-white rounded-md shadow-md flex flex-col justify-center items-center">
                              <div className="h-2 w-1/2 bg-[#e0e0e0] rounded-sm mb-1.5"></div>
                              <div className="h-2 w-2/3 bg-[#e0e0e0] rounded-sm"></div>
                            </div>
                          </div>
                          
                          <div className="flex items-center px-2 py-2">
                            <div className={`w-4 h-4 rounded-full border ${selectedTheme === 'light' ? 'border-[#ffcc40]' : 'border-gray-500'} flex items-center justify-center mr-2`}>
                              {selectedTheme === 'light' && (
                                <div className="w-2 h-2 rounded-full bg-[#ffcc40]"></div>
                              )}
                            </div>
                            <span className="text-gray-300 mr-1">Light</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                              <circle cx="12" cy="12" r="4"></circle>
                              <path d="M12 2v2"></path>
                              <path d="M12 20v2"></path>
                              <path d="m4.93 4.93 1.41 1.41"></path>
                              <path d="m17.66 17.66 1.41 1.41"></path>
                              <path d="M2 12h2"></path>
                              <path d="M20 12h2"></path>
                              <path d="m6.34 17.66-1.41 1.41"></path>
                              <path d="m19.07 4.93-1.41 1.41"></path>
                            </svg>
                          </div>
                        </div>
                        
                        {/* OLED theme */}
                        <div 
                          className={`bg-[#141414] rounded-2xl p-1 cursor-pointer border ${selectedTheme === 'oled' ? 'border-gray-500' : 'border-[#232323]'}`}
                          onClick={() => handleThemeChange('oled')}
                        >
                          {/* Improved preview with card UI */}
                          <div className="bg-black p-4 rounded-2xl mb-0 h-[100px] relative overflow-hidden">
                            {/* Card UI on pure black background */}
                            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 h-3/5 bg-[#111] rounded-md shadow-md flex flex-col justify-center items-center">
                              <div className="h-2 w-1/2 bg-[#222] rounded-sm mb-1.5"></div>
                              <div className="h-2 w-2/3 bg-[#222] rounded-sm"></div>
                            </div>
                          </div>
                          
                          <div className="flex items-center px-2 py-2">
                            <div className={`w-4 h-4 rounded-full ${selectedTheme === 'oled' ? 'border-[#ffcc40]' : 'border-gray-500'} flex items-center justify-center mr-2 border`}>
                              {selectedTheme === 'oled' && (
                                <div className="w-2 h-2 rounded-full bg-[#ffcc40]"></div>
                              )}
                            </div>
                            <span className="text-gray-300">OLED</span>
                          </div>
                        </div>
                        
                        {/* Sync with system */}
                        <div 
                          className={`bg-[#141414] rounded-2xl p-1 cursor-pointer border ${selectedTheme === 'system' ? 'border-gray-500' : 'border-[#232323]'}`}
                          onClick={() => handleThemeChange('system')}
                        >
                          {/* Improved preview with card UI */}
                          <div className="bg-gradient-to-r from-[#18181b] to-[#fafafa] p-4 rounded-2xl mb-0 h-[100px] relative overflow-hidden">
                            {/* Half dark, half light card UI */}
                            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 h-3/5 bg-gradient-to-r from-[#27272a] to-[#f1f1f1] rounded-2xl shadow-md flex">
                              <div className="w-1/2 h-full flex items-center justify-center">
                                <div className="w-4 h-4 rounded-full bg-[#333]"></div>
                              </div>
                              <div className="w-1/2 h-full flex items-center justify-center">
                                <div className="w-4 h-4 rounded-full bg-white"></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center px-2 py-2">
                            <div className={`w-4 h-4 rounded-full border ${selectedTheme === 'system' ? 'border-[#ffcc40]' : 'border-gray-500'} flex items-center justify-center mr-2`}>
                              {selectedTheme === 'system' && (
                                <div className="w-2 h-2 rounded-full bg-[#ffcc40]"></div>
                              )}
                            </div>
                            <span className="text-gray-300">Sync with</span>
                            <span className="text-gray-300 ml-1">system</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeSettingsTab === 'privacy' && (
                    <div>
                      <h3 className={`text-xl ${themeClasses.text} font-medium mb-4`}>Privacy Settings</h3>
                      
                      {/* Discord RPC setting with toggle */}
                      <div className={`mt-6 flex items-center justify-between ${themeClasses.cardBackground} p-4 rounded-lg border ${themeClasses.border}`}>
                        <div className="flex-1 pr-4">
                          <h4 className={`${themeClasses.text} font-medium mb-1`}>Discord RPC</h4>
                          <p className={`${themeClasses.secondaryText} text-sm`}>
                            Manages the Discord Rich Presence integration. Disabling this will cause 'Modrinth' to no longer show up as a game or app you are using on your Discord profile.
                          </p>
                          <p className="text-gray-500 text-sm mt-2 italic">
                            Note: This will not prevent any instance-specific Discord Rich Presence integrations, such as those added by mods. (app restart required to take effect)
                          </p>
                        </div>
                        
                        {/* Toggle switch */}
                        <label className="inline-flex items-center cursor-pointer">
                          <div className="relative">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={discordRpcEnabled} 
                              onChange={handleDiscordRpcToggle}
                            />
                            <div 
                              className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out`}
                              style={{
                                backgroundColor: discordRpcEnabled 
                                  ? 'rgba(255, 204, 64, 0.3)' 
                                  : 'var(--bg-card)'
                              }}
                            ></div>
                            <div 
                              className={`absolute top-[2px] left-[2px] w-5 h-5 rounded-full transition-all duration-200 ease-in-out
                                ${discordRpcEnabled ? 'translate-x-5' : ''}`
                              }
                              style={{
                                backgroundColor: discordRpcEnabled ? '#ffcc40' : 'var(--text-secondary)',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                              }}
                            ></div>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
