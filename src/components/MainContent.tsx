import React from 'react';

interface MainContentProps {
  themeClasses: {
    background: string;
    secondaryBackground: string;
    cardBackground: string;
    text: string;
    secondaryText: string;
    border: string;
  };
  titlebarHeight: number;
  sidebarWidth: number;
  overlapAmount: number;
}

const MainContent: React.FC<MainContentProps> = ({ 
  themeClasses, 
  titlebarHeight, 
  sidebarWidth, 
  overlapAmount 
}) => {
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
        className={`w-full h-full ${themeClasses.background} rounded-tl-[24px] p-4 ${themeClasses.text} overflow-auto border-t border-l ${themeClasses.border}`}
        style={{
          boxShadow: 'inset 0 4px 8px -2px rgba(0,0,0,0.10), inset 4px 0 8px -2px rgba(0,0,0,0.10)'
        }}
      >
        {/* Content will go here */}
      </main>
    </div>
  );
};

export default MainContent; 