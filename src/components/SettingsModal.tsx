import React from 'react';
import SettingsSidebar from './SettingsSidebar';
import AppearanceSettings from './AppearanceSettings';
import PrivacySettings from './PrivacySettings';

interface SettingsModalProps {
  themeClasses: {
    background: string;
    secondaryBackground: string;
    cardBackground: string;
    text: string;
    secondaryText: string;
    border: string;
  };
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  activeSettingsTab: string;
  setActiveSettingsTab: (tab: string) => void;
  systemInfo: { os: string; version: string };
  selectedTheme: string;
  selectedTitlebarStyle: string;
  handleThemeChange: (theme: string) => void;
  handleTitlebarStyleChange: (style: string) => void;
  t: (key: string, defaultValue?: string) => string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  themeClasses,
  showSettings,
  setShowSettings,
  activeSettingsTab,
  setActiveSettingsTab,
  systemInfo,
  selectedTheme,
  selectedTitlebarStyle,
  handleThemeChange,
  handleTitlebarStyleChange,
  t
}) => {
  if (!showSettings) return null;
  
  return (
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
            <h2 className={`text-xl font-medium ${themeClasses.text}`}>{t('settings.title', 'Settings')}</h2>
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
          <SettingsSidebar 
            themeClasses={themeClasses}
            activeSettingsTab={activeSettingsTab}
            setActiveSettingsTab={setActiveSettingsTab}
            systemInfo={systemInfo}
            t={t}
          />
          
          {/* Right Content Area */}
          <div className={`flex-1 ${themeClasses.secondaryBackground} relative`}>
            {/* Vertical separator line - делаем более заметным */}
            <div className={`absolute left-0 top-[8%] bottom-[8%] w-[2px] bg-[var(--border-color)] opacity-70`}></div>
            
            {/* Content for the active tab */}
            <div className="p-8 h-full">
              {activeSettingsTab === 'appearance' && (
                <AppearanceSettings
                  themeClasses={themeClasses}
                  selectedTheme={selectedTheme}
                  selectedTitlebarStyle={selectedTitlebarStyle}
                  handleThemeChange={handleThemeChange}
                  handleTitlebarStyleChange={handleTitlebarStyleChange}
                  t={t}
                />
              )}
              
              {activeSettingsTab === 'privacy' && (
                <PrivacySettings
                  themeClasses={themeClasses}
                  t={t}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsModal; 