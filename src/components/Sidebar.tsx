import React, { useState } from 'react';
import { ThemeClasses } from '../types/interfaces';

interface SidebarProps {
  themeClasses: ThemeClasses;
  titlebarHeight: number;
  overlapAmount: number;
  bottomPadding: number;
  onSettingsClick: () => void;
  t: (key: string, defaultValue?: string) => string;
  showTooltip: (text: string, position: { top: number; left?: number }) => void;
  hideTooltip: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  themeClasses, 
  titlebarHeight, 
  overlapAmount, 
  bottomPadding, 
  onSettingsClick,
  t,
  showTooltip,
  hideTooltip
}) => {
  // Calculate settings button position
  const sidebarWidth = 70;
  const buttonSize = 48; // w-12 = 48px (12 * 4px in Tailwind)
  const visibleSidebarWidth = sidebarWidth - overlapAmount; // 61px
  const buttonLeftPosition = (visibleSidebarWidth - buttonSize) / 2; // Center in visible area
  
  // Обработчик для наведения на кнопку настроек
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const buttonCenterY = rect.top + rect.height / 2;
    showTooltip(t('tooltip.settings', 'Settings'), { top: buttonCenterY });
  };
  
  return (
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
          className="w-12 h-12 flex items-center justify-center hover-effect hover:shadow-md active:scale-95 active:translate-y-[1px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full transition-all absolute"
          style={{ left: `${buttonLeftPosition}px` }}
          onClick={onSettingsClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={hideTooltip}
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
  );
};

export default Sidebar; 