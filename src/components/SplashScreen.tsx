import { useEffect, useState } from 'react';
import appIcon from '../assets/beer.svg';

interface SplashScreenProps {
  onInitialized: () => void;
  progress?: number;
}

const SplashScreen = ({ onInitialized, progress = 0 }: SplashScreenProps) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Simulate initialization process
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        // Update progress based on external progress or increment by steps
        const newProgress = progress > 0 ? progress : Math.min(prev + 2, 100);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onInitialized();
          }, 500); // Small delay for smooth transition
        }
        
        return newProgress;
      });
    }, 30);
    
    return () => clearInterval(interval);
  }, [progress, onInitialized]);
  
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
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        
        {/* Status text */}
        <p className="mt-4 text-[var(--text-secondary)]">Initializing application...</p>
      </div>
    </div>
  );
};

export default SplashScreen; 