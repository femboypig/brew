import intelligenceIcon from '../assets/Intelligence.svg';
import intelligenceWhiteIcon from '../assets/Intelligence-white.svg';
import { useEffect, useState } from 'react';

/**
 * Returns the appropriate Intelligence icon based on the current theme
 * @param theme - The current theme ('light', 'dark', 'oled', or 'system')
 * @returns The correct SVG icon for the theme
 */
export const getIntelligenceIcon = (theme: string): string => {
  // For light theme, use the white icon (which has a white segment in the gradient)
  // For dark and oled themes, use the regular icon
  if (theme === 'light' || 
      (theme === 'system' && 
       window.matchMedia && 
       !window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    return intelligenceWhiteIcon;
  }
  
  // Default to regular icon for dark/oled themes or when system theme is dark
  return intelligenceIcon;
};

// Cache to track previous theme to determine if animation should be played
let previousTheme: string | null = null;

/**
 * Returns the appropriate Intelligence icon and CSS classes for smooth transitions
 * @param theme - The current theme ('light', 'dark', 'oled', or 'system')
 * @returns Object with icon src and CSS classes
 */
// This function is unused and seems to be a remnant of an old implementation.
// The `useRotatingThemeIcon` hook is now used for theme-based icon animations.
/*
export const getIntelligenceIconWithTransition = (theme: string): { 
  src: string, 
  className: string 
} => {
  const src = getIntelligenceIcon(theme);
  let className = "app-icon-transition";
  
  // Add animation class if theme has changed
  if (previousTheme !== null && previousTheme !== theme) {
    className += " app-icon-theme-change";
  }
  
  // Update previous theme cache
  previousTheme = theme;
  
  return { src, className };
};
*/

// Animation duration in milliseconds - keep in sync with CSS
const ANIMATION_DURATION = 1200;

/**
 * React hook that provides a smooth rotating icon transition between themes
 * @param currentTheme - The current theme ('light', 'dark', 'oled', or 'system')
 * @returns All necessary props for the icon container and both icon elements
 */
export const useRotatingThemeIcon = (currentTheme: string) => {
  const isDarkMode = currentTheme === 'dark' || currentTheme === 'oled' || 
    (currentTheme === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  const [isFlipping, setIsFlipping] = useState(false);
  const [lastThemeWasDark, setLastThemeWasDark] = useState(isDarkMode);
  
  useEffect(() => {
    // Only animate if the theme has actually changed
    if (lastThemeWasDark !== isDarkMode) {
      setIsFlipping(true);
      
      // Reset flipping state after animation completes with a slight delay for smoother transition
      const timer = setTimeout(() => {
        setIsFlipping(false);
        setLastThemeWasDark(isDarkMode);
      }, ANIMATION_DURATION + 100); // Add a buffer to ensure animation completes smoothly
      
      return () => clearTimeout(timer);
    }
  }, [isDarkMode, lastThemeWasDark]);
  
  return {
    containerProps: {
      className: `icon-container ${isFlipping ? 'flip-active' : ''}`,
    },
    frontIconProps: {
      src: isDarkMode ? intelligenceIcon : intelligenceWhiteIcon,
      className: 'icon-front app-icon-transition',
      alt: "App Icon",
    },
    backIconProps: {
      src: isDarkMode ? intelligenceWhiteIcon : intelligenceIcon,
      className: 'icon-back app-icon-transition',
      alt: "App Icon",
    }
  };
}; 