import React, { useEffect, useState } from 'react';
import { useRotatingThemeIcon } from '../utils/themeUtils';

interface SettingsSidebarProps {
  themeClasses: {
    background: string;
    secondaryBackground: string;
    cardBackground: string;
    text: string;
    secondaryText: string;
    border: string;
  };
  activeSettingsTab: string;
  setActiveSettingsTab: (tab: string) => void;
  systemInfo: { os: string; version: string };
  t: (key: string, defaultValue?: string) => string;
  selectedTheme: string;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  themeClasses,
  activeSettingsTab,
  setActiveSettingsTab,
  systemInfo,
  t,
  selectedTheme
}) => {
  const { containerProps, frontIconProps, backIconProps } = useRotatingThemeIcon(selectedTheme);
  
  return (
    <div className="w-[260px] h-full flex flex-col">
      {/* Settings options buttons */}
      <div className="flex-1 overflow-y-auto pt-10 px-4">
        {/* Appearance button with theme-adaptive active effect */}
        <button
          className={`w-full py-1 px-4 mb-2 text-left rounded-xl flex items-center transition-all sidebar-button
            ${activeSettingsTab === 'appearance'
              ? 'text-[#ffcc40] shadow-inner border'
              : `${themeClasses.secondaryText} hover:text-[var(--text-primary)]`
            }
            focus:outline-none
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
          <span className="font-bold">{t('settings.tab.appearance', 'Appearance')}</span>
        </button>

        {/* Privacy button */}
        <button
          className={`w-full py-1 px-4 mb-2 text-left rounded-xl flex items-center transition-all sidebar-button
            ${activeSettingsTab === 'privacy'
              ? 'text-[#ffcc40] shadow-inner border'
              : `${themeClasses.secondaryText} hover:text-[var(--text-primary)]`
            }
            focus:outline-none
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
          <span className="font-bold">{t('settings.tab.privacy', 'Privacy')}</span>
        </button>
      </div>

      {/* App Info - no top border */}
      <div className="p-5 flex items-center">
        <div className="flex items-center">
          <div {...containerProps} style={{ width: '32px', height: '32px', marginRight: '12px' }}>
            <img {...frontIconProps} className={`w-8 h-8 ${frontIconProps.className}`} />
            <img {...backIconProps} className={`w-8 h-8 ${backIconProps.className}`} />
          </div>
          <div>
            <p className={`${themeClasses.secondaryText} text-sm font-medium`}>Intelligence App 0.0.5</p>
            <p className={`${themeClasses.secondaryText} text-xs`}>{systemInfo.os} {systemInfo.version}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSidebar; 