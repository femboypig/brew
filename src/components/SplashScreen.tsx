import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import appIcon from '../assets/beer.svg';

interface LanguageMetadata {
  id: string;
  version: string;
  author: string;
}

interface Language {
  metadata: LanguageMetadata;
  [key: string]: string | LanguageMetadata;
}

interface SplashScreenProps {
  onInitialized: () => void;
  progress?: number;
  onLanguageLoaded?: (translations: {[key: string]: string}) => void;
}

const SplashScreen = ({ onInitialized, progress = 0, onLanguageLoaded }: SplashScreenProps) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('init');
  
  // Load language during initialization
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        setLoadingStage('loading_language');
        setLoadingProgress(30); // Jump to 30% immediately when language loading starts
        
        // Get translations from Rust backend
        const language = await invoke<Language>('get_translations');
        
        // Convert to simple key-value object for translations
        const translations: {[key: string]: string} = {};
        for (const key in language) {
          if (key !== 'metadata' && typeof language[key] === 'string') {
            translations[key] = language[key] as string;
          }
        }
        
        // Send translations back to parent
        if (onLanguageLoaded) {
          onLanguageLoaded(translations);
        }
        
        setLoadingStage('language_loaded');
        setLoadingProgress(100); // Jump to 100% immediately after language is loaded
        
        // Complete initialization with minimal delay
        setTimeout(() => {
          onInitialized();
        }, 100); // Reduced delay from 500ms to 100ms
        
        return true;
      } catch (error) {
        console.error('Failed to load language:', error);
        setLoadingStage('language_error');
        
        // Even on error, proceed to the main UI after a brief delay
        setTimeout(() => {
          onInitialized();
        }, 300);
        
        return false;
      }
    };
    
    loadLanguage();
  }, [onLanguageLoaded, onInitialized]);
  
  // We don't need the slow progress animation anymore since we're using
  // direct progress updates based on actual loading stages
  useEffect(() => {
    // Only use external progress if provided
    if (progress > 0) {
      setLoadingProgress(progress);
    }
  }, [progress]);
  
  // Get loading message based on current stage
  const getLoadingMessage = () => {
    switch (loadingStage) {
      case 'loading_language':
        return 'Loading language...';
      case 'language_loaded':
        return 'Starting application...';
      case 'language_error':
        return 'Error loading language...';
      default:
        return 'Initializing application...';
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-[var(--bg-primary)]">
      <div className="flex flex-col items-center">
        {/* App Icon with pulsating animation */}
        <div className="mb-6 animate-pulse">
          <img src={appIcon} alt="App Icon" className="w-24 h-24" />
        </div>
        
        {/* App name */}
        <h1 className="text-4xl font-bold mb-8 text-[var(--text-primary)]">brew</h1>
        
        {/* Progress bar */}
        <div className="w-64 h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-200 ease-out"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        
        {/* Status text */}
        <p className="mt-4 text-[var(--text-secondary)]">{getLoadingMessage()}</p>
      </div>
    </div>
  );
};

export default SplashScreen; 