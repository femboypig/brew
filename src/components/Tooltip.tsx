import React, { useState, useEffect } from 'react';
import { ThemeClasses } from '../types/interfaces';

interface TooltipProps {
  text: string;
  show: boolean;
  position: { top: number; left?: number; };
  themeClasses: ThemeClasses;
  theme: string; // 'dark', 'light', 'oled', 'system'
}

const Tooltip: React.FC<TooltipProps> = ({ text, show, position, themeClasses, theme }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      // Добавляем задержку 250мс для появления
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 250);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show]);

  // Определяем дополнительные стили в зависимости от темы
  const getThemeSpecificStyles = () => {
    switch (theme) {
      case 'dark':
        return {
          backgroundColor: 'var(--bg-card, #27272a)',
          borderColor: 'var(--border-color, #333333)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
          arrowColor: 'var(--bg-card, #27272a)'
        };
      case 'light':
        return {
          backgroundColor: 'var(--bg-card, #f0f0f0)',
          borderColor: 'var(--border-color, #e0e0e0)',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          arrowColor: 'var(--bg-card, #f0f0f0)'
        };
      case 'oled':
        return {
          backgroundColor: 'var(--bg-card, #111111)',
          borderColor: 'var(--border-color, #222222)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)',
          arrowColor: 'var(--bg-card, #111111)'
        };
      default: // system - используем те же стили, что и для dark/light
        return {
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          arrowColor: 'var(--bg-card)'
        };
    }
  };

  const themeStyles = getThemeSpecificStyles();

  if (!isVisible) return null;

  return (
    <div
      className={`fixed z-50 px-3 py-1.5 rounded-2xl text-sm font-medium border ${themeClasses.text}`}
      style={{
        top: position.top,
        left: position.left,
        backgroundColor: themeStyles.backgroundColor,
        borderColor: themeStyles.borderColor,
        boxShadow: themeStyles.boxShadow,
        transform: 'translateY(-50%)',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.15s ease-in-out',
        pointerEvents: 'none'
      }}
    >
      {/* Левая стрелка */}
      <div
        className="absolute -left-2 w-0 h-0"
        style={{
          borderTop: '6px solid transparent',
          borderBottom: '6px solid transparent',
          borderRight: `6px solid ${themeStyles.arrowColor}`,
          marginTop: '-6px',
          top: '50%'
        }}
      ></div>

      {/* Контент тултипа */}
      {text}
    </div>
  );
};

export default Tooltip; 