import React from 'react';
import ThemeCard from './ThemeCard';

interface AppearanceSettingsProps {
  themeClasses: {
    background: string;
    secondaryBackground: string;
    cardBackground: string;
    text: string;
    secondaryText: string;
    border: string;
  };
  selectedTheme: string;
  selectedTitlebarStyle: string;
  handleThemeChange: (theme: string) => void;
  handleTitlebarStyleChange: (style: string) => void;
  t: (key: string, defaultValue?: string) => string;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  themeClasses,
  selectedTheme,
  selectedTitlebarStyle,
  handleThemeChange,
  handleTitlebarStyleChange,
  t
}) => {
  return (
    <div className="h-[400px] overflow-y-auto pr-2">
      <h3 className={`text-xl ${themeClasses.text} font-medium mb-2`}>{t('settings.appearance.color_theme', 'Color theme')}</h3>
      <p className={`${themeClasses.secondaryText} text-sm mb-5`}>{t('settings.appearance.color_theme.description', 'Select your preferred color theme for Modrinth App.')}</p>
      
      {/* Theme selector grid - restored original size */}
      <div className="grid grid-cols-2 gap-4 max-w-md">
        {/* Dark theme */}
        <ThemeCard
          theme="dark"
          selectedTheme={selectedTheme}
          title="Dark"
          themeClasses={themeClasses}
          t={t}
          onClick={() => handleThemeChange('dark')}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
            </svg>
          }
          previewContent={
            <div className="bg-[#18181b] p-4 rounded-2xl mb-0 h-[100px] relative overflow-hidden">
              {/* Card UI on dark background */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 h-3/5 bg-[#27272a] rounded-md shadow-md flex flex-col justify-center items-center">
                <div className="h-2 w-1/2 bg-[#3a3a3f] rounded-sm mb-1.5"></div>
                <div className="h-2 w-2/3 bg-[#3a3a3f] rounded-sm"></div>
              </div>
            </div>
          }
        />
        
        {/* Light theme */}
        <ThemeCard
          theme="light"
          selectedTheme={selectedTheme}
          title="Light"
          themeClasses={themeClasses}
          t={t}
          onClick={() => handleThemeChange('light')}
          icon={
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
          }
          previewContent={
            <div className="bg-[#f8f8f8] p-4 rounded-2xl mb-0 h-[100px] relative overflow-hidden">
              {/* Card UI on light background */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 h-3/5 bg-white rounded-md shadow-md flex flex-col justify-center items-center">
                <div className="h-2 w-1/2 bg-[#e0e0e0] rounded-sm mb-1.5"></div>
                <div className="h-2 w-2/3 bg-[#e0e0e0] rounded-sm"></div>
              </div>
            </div>
          }
        />
        
        {/* OLED theme */}
        <ThemeCard
          theme="oled"
          selectedTheme={selectedTheme}
          title="OLED"
          themeClasses={themeClasses}
          t={t}
          onClick={() => handleThemeChange('oled')}
          previewContent={
            <div className="bg-black p-4 rounded-2xl mb-0 h-[100px] relative overflow-hidden">
              {/* Card UI on pure black background */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 h-3/5 bg-[#111] rounded-md shadow-md flex flex-col justify-center items-center">
                <div className="h-2 w-1/2 bg-[#222] rounded-sm mb-1.5"></div>
                <div className="h-2 w-2/3 bg-[#222] rounded-sm"></div>
              </div>
            </div>
          }
        />
        
        {/* Sync with system */}
        <ThemeCard
          theme="system"
          selectedTheme={selectedTheme}
          title="Sync"
          themeClasses={themeClasses}
          t={t}
          onClick={() => handleThemeChange('system')}
          previewContent={
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
          }
        />
      </div>

      {/* Titlebar Style Section */}
      <h3 className={`text-xl ${themeClasses.text} font-medium mb-2 mt-10`}>{t('settings.appearance.titlebar_style', 'Titlebar Style')}</h3>
      <p className={`${themeClasses.secondaryText} text-sm mb-5`}>{t('settings.appearance.titlebar_style.description', 'Choose how the application window titlebar should look.')}</p>
      
      {/* Titlebar style selector grid */}
      <div className="grid grid-cols-3 gap-4 max-w-md">
        {/* Custom titlebar (current style) */}
        <ThemeCard
          theme="custom"
          selectedTheme={selectedTitlebarStyle}
          title="Custom"
          themeClasses={themeClasses}
          t={(key, defaultValue) => {
            // Adjust the key for titlebar styles
            const adjustedKey = key.replace('theme', 'titlebar');
            return t(adjustedKey, defaultValue);
          }}
          onClick={() => handleTitlebarStyleChange('custom')}
          previewContent={
            <div className={`${themeClasses.secondaryBackground} p-2 rounded-t-2xl mb-0 h-[50px] relative overflow-hidden border-b ${themeClasses.border} flex items-center justify-center`}>
              {/* Window controls */}
              <div className="flex space-x-1">
                <div className="w-8 h-8 rounded-full hover:bg-[var(--bg-card)] flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                <div className="w-8 h-8 rounded-full hover:bg-[var(--bg-card)] flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  </svg>
                </div>
                <div className="w-8 h-8 rounded-full hover:bg-[#ff3333] flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
              </div>
            </div>
          }
        />
        
        {/* Native titlebar (Windows style) */}
        <ThemeCard
          theme="native"
          selectedTheme={selectedTitlebarStyle}
          title="Native"
          themeClasses={themeClasses}
          t={(key, defaultValue) => {
            // Adjust the key for titlebar styles
            const adjustedKey = key.replace('theme', 'titlebar');
            return t(adjustedKey, defaultValue);
          }}
          onClick={() => handleTitlebarStyleChange('native')}
          previewContent={
            <div className="bg-[#f0f0f0] p-2 rounded-t-2xl mb-0 h-[50px] relative overflow-hidden flex items-center justify-center">
              {/* Windows controls */}
              <div className="flex h-[36px]">
                <div className="w-11 h-full hover:bg-[#e5e5e5] flex items-center justify-center">
                  <div className="w-2.5 h-0.5 bg-[#333333]"></div>
                </div>
                <div className="w-11 h-full hover:bg-[#e5e5e5] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 border border-[#333333]"></div>
                </div>
                <div className="w-11 h-full hover:bg-[#e81123] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 relative">
                    <div className="absolute w-3 h-0.5 bg-[#333333] rotate-45"></div>
                    <div className="absolute w-3 h-0.5 bg-[#333333] -rotate-45"></div>
                  </div>
                </div>
              </div>
            </div>
          }
        />
        
        {/* macOS style titlebar */}
        <ThemeCard
          theme="macos"
          selectedTheme={selectedTitlebarStyle}
          title="macOS"
          themeClasses={themeClasses}
          t={(key, defaultValue) => {
            // Adjust the key for titlebar styles
            const adjustedKey = key.replace('theme', 'titlebar');
            return t(adjustedKey, defaultValue);
          }}
          onClick={() => handleTitlebarStyleChange('macos')}
          previewContent={
            <div className={`${themeClasses.secondaryBackground} p-2 rounded-t-2xl mb-0 h-[50px] relative overflow-hidden border-b ${themeClasses.border} flex items-center justify-center`}>
              {/* Traffic light controls */}
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
              </div>
            </div>
          }
        />
      </div>
      
      {/* Note about restart */}
      <p className={`${themeClasses.secondaryText} text-sm mt-3 italic`}>
        {t('settings.appearance.titlebar.note', 'Note: Changing the titlebar style requires restarting the application.')}
      </p>
    </div>
  );
};

export default AppearanceSettings; 