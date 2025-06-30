import React from 'react';
import Tooltip from './Tooltip';
import { ThemeClasses } from '../types/interfaces';

interface TooltipData {
  show: boolean;
  text: string;
  position: {
    top: number;
    left?: number; // Может быть не определено для автоматического выравнивания
  };
}

interface MainContentProps {
  themeClasses: ThemeClasses;
  titlebarHeight: number;
  sidebarWidth: number;
  overlapAmount: number;
  tooltip: TooltipData | null;
  selectedTheme: string;
}

const MainContent: React.FC<MainContentProps> = ({ 
  themeClasses, 
  titlebarHeight, 
  sidebarWidth, 
  overlapAmount,
  tooltip,
  selectedTheme
}) => {
  // Установка позиции тултипа (добавляем left, если не указан)
  const tooltipWithDefaultPosition = tooltip 
    ? {
        ...tooltip, 
        position: {
          ...tooltip.position, 
          left: tooltip.position.left ?? (sidebarWidth - overlapAmount + 10) // 10px отступ от края main content
        }
      }
    : null;
    
  return (
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
        className={`w-full h-full ${themeClasses.background} rounded-tl-[24px] p-4 ${themeClasses.text} overflow-auto border-t border-l ${themeClasses.border} relative`}
        style={{
          boxShadow: 'inset 0 4px 8px -2px rgba(0,0,0,0.10), inset 4px 0 8px -2px rgba(0,0,0,0.10)'
        }}
      >
        {/* Content will go here */}
        
        {/* Использование компонента Tooltip */}
        {tooltip && (
          <Tooltip
            text={tooltipWithDefaultPosition?.text || ''}
            show={tooltipWithDefaultPosition?.show || false}
            position={tooltipWithDefaultPosition?.position || {top: 0}}
            themeClasses={themeClasses}
            theme={selectedTheme}
          />
        )}
      </main>
    </div>
  );
};

export default MainContent; 