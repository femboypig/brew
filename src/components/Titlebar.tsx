import { Window } from '@tauri-apps/api/window';
import appIcon from '../assets/beer.svg';

interface TitlebarProps {
  selectedTitlebarStyle: string;
  t: (key: string, defaultValue?: string) => string;
  themeClasses: {
    background: string;
    secondaryBackground: string;
    cardBackground: string;
    text: string;
    secondaryText: string;
    border: string;
  };
}

const Titlebar = ({ selectedTitlebarStyle, t, themeClasses }: TitlebarProps) => {
  const appWindow = Window.getCurrent();
  
  return (
    <div 
      className={`w-full h-[55px] ${themeClasses.secondaryBackground} fixed top-0 left-0 right-0 flex items-center justify-between border-b ${themeClasses.border} z-10`}
      data-tauri-drag-region
    >
      {/* Left side with logo - adjusted to avoid overlap */}
      <div className="flex items-center h-full pl-0 z-20 relative top-[-4px]" data-tauri-drag-region>
        {selectedTitlebarStyle === 'macos' ? (
          <>
            {/* macOS style traffic light controls */}
            <div className="flex items-center ml-3 space-x-2 mr-3">
              <button 
                className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] hover:bg-[#ff5f57] hover:brightness-110 active:brightness-90 no-drag flex items-center justify-center mac-button"
                onClick={() => appWindow.close()}
              >
                <span className="opacity-0 mac-icon text-[8px] text-[#450000]">✕</span>
              </button>
              <button 
                className="w-3.5 h-3.5 rounded-full bg-[#febc2e] hover:bg-[#febc2e] hover:brightness-110 active:brightness-90 no-drag flex items-center justify-center mac-button"
                onClick={() => appWindow.minimize()}
              >
                <span className="opacity-0 mac-icon text-[8px] text-[#5a4000]">−</span>
              </button>
              <button 
                className="w-3.5 h-3.5 rounded-full bg-[#28c840] hover:bg-[#28c840] hover:brightness-110 active:brightness-90 no-drag flex items-center justify-center mac-button"
                onClick={() => appWindow.toggleMaximize()}
              >
                <span className="opacity-0 mac-icon text-[8px] text-[#004d00]">+</span>
              </button>
            </div>
            
            {/* App icon and title */}
            <div className="flex items-center">
              <img src={appIcon} alt="App Icon" className="w-9 h-9 mr-2" />
              <span className={`${themeClasses.text} font-medium text-2xl tracking-tight antialiased`} data-tauri-drag-region>
                {t('app.title', 'brew')}
              </span>
            </div>
          </>
        ) : (
          <>
            {/* Custom style with logo on left */}
            <span className={`${themeClasses.text} font-medium text-2xl tracking-tight ml-16 antialiased`} data-tauri-drag-region>{t('app.title', 'brew')}</span>
          </>
        )}
      </div>
      
      {/* App icon at the intersection - для custom и native стилей */}
      {selectedTitlebarStyle !== 'macos' && (
      <div className="absolute left-[16px] top-[7px] z-30">
        <img src={appIcon} alt="App Icon" className="w-9 h-9" />
      </div>
      )}
      
      {/* Right side with status indicator and window controls - adjusted to avoid overlap */}
      <div className="flex items-center h-full relative top-[-4px]" data-tauri-drag-region>
        {/* Status indicator with border and rounded corners */}
        <div className={`flex items-center border ${themeClasses.border} rounded-full px-3 py-1 mr-2 ${themeClasses.secondaryBackground}`} data-tauri-drag-region>
          <span className="w-2 h-2 rounded-full bg-gray-400 mr-2" data-tauri-drag-region></span>
          <span className={`text-sm ${themeClasses.secondaryText} antialiased`} data-tauri-drag-region>{t('app.status.no_instances', 'No instances running')}</span>
        </div>
        
        {/* Window controls - только для custom стиля */}
        {selectedTitlebarStyle === 'custom' && (
        <div className="flex no-drag">
          <button 
            className="w-10 h-10 flex items-center justify-center hover:bg-[var(--bg-card)] active:scale-95 active:translate-y-[1px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full mx-1 transition-all no-drag hover-effect"
            onClick={() => appWindow.minimize()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button 
            className="w-10 h-10 flex items-center justify-center hover:bg-[var(--bg-card)] active:scale-95 active:translate-y-[1px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full mx-1 transition-all no-drag hover-effect"
            onClick={() => appWindow.toggleMaximize()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            </svg>
          </button>
          <button 
            className="w-10 h-10 flex items-center justify-center hover:bg-[#ff0000] active:scale-95 text-gray-400 hover:text-white rounded-full mx-1 transition-all no-drag hover-effect-close"
            onClick={() => appWindow.close()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        )}
      </div>
    </div>
  );
};

export default Titlebar; 