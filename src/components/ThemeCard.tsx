import React from 'react';

interface ThemeCardProps {
  theme: string;
  selectedTheme: string;
  title: string;
  themeClasses: {
    background: string;
    secondaryBackground: string;
    cardBackground: string;
    text: string;
    secondaryText: string;
    border: string;
  };
  t: (key: string, defaultValue?: string) => string;
  onClick: () => void;
  icon?: React.ReactNode;
  previewContent: React.ReactNode;
}

const ThemeCard: React.FC<ThemeCardProps> = ({ 
  theme, 
  selectedTheme, 
  title,
  themeClasses,
  t,
  onClick,
  icon,
  previewContent
}) => {
  return (
    <div 
      className={`rounded-2xl p-1 cursor-pointer border transition-colors duration-200 ${selectedTheme === theme 
        ? 'border-[#ffcc40] shadow-md' 
        : `border-[var(--border-color)]`}`}
      style={{
        backgroundColor: themeClasses.secondaryBackground.includes('bg-[var(--bg-secondary)]') 
          ? 'var(--bg-secondary)' 
          : '#141414'
      }}
      onClick={onClick}
    >
      {/* Preview area for theme */}
      {previewContent}
      
      <div className={`flex items-center px-2 py-2 ${themeClasses.text}`}>
        <div className={`w-4 h-4 rounded-full border ${selectedTheme === theme ? 'border-[#ffcc40]' : 'border-gray-500'} flex items-center justify-center mr-2`}>
          {selectedTheme === theme && (
            <div className="w-2 h-2 rounded-full bg-[#ffcc40]"></div>
          )}
        </div>
        <span className={`mr-1 ${selectedTheme === theme ? 'text-[#ffcc40]' : ''}`}>
          {t(`settings.appearance.theme.${theme.toLowerCase()}`, title)}
        </span>
        {icon && icon}
      </div>
    </div>
  );
};

export default ThemeCard; 