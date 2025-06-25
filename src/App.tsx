import { Window } from '@tauri-apps/api/window';
import { useState, useEffect } from 'react';
import appIcon from './assets/beer.svg';

function App() {
  const appWindow = Window.getCurrent();
  const [showSettings, setShowSettings] = useState(false);
  const [systemInfo, setSystemInfo] = useState({ os: 'Linux', version: '22.4.0' });
  
  // Get real system info on mount
  useEffect(() => {
    const getSystemInfo = async () => {
      try {
        // In a real app we would use Tauri API to get this info
        setSystemInfo({
          os: 'Linux',
          version: '5.15.0-142-generic'
        });
      } catch (error) {
        console.error('Failed to get system info:', error);
      }
    };
    
    getSystemInfo();
  }, []);
  
  // Define exact dimensions for precise calculations
  const titlebarHeight = 55;
  const sidebarWidth = 70;
  const overlapAmount = 9; // Reduced by 1px for more precise positioning
  const bottomPadding = 25; // Padding to avoid overlap at the bottom
  
  // Calculate settings button position
  const buttonSize = 48; // w-12 = 48px (12 * 4px in Tailwind)
  const visibleSidebarWidth = sidebarWidth - overlapAmount; // 61px
  const buttonLeftPosition = (visibleSidebarWidth - buttonSize) / 2; // Center in visible area
  
  return (
    <div className="flex h-screen w-screen bg-black overflow-hidden relative">
      {/* Titlebar - height 55px */}
      <div 
        className="w-full h-[55px] bg-[#0a0a0a] fixed top-0 left-0 right-0 flex items-center justify-between border-b border-[#222] z-10"
        data-tauri-drag-region
      >
        {/* Left side with logo - adjusted to avoid overlap */}
        <div className="flex items-center h-full pl-0 z-20 relative top-[-4px]" data-tauri-drag-region>
          <span className="text-white font-medium text-2xl tracking-tight ml-16 antialiased" data-tauri-drag-region>brew</span>
        </div>
        
        {/* App icon at the intersection */}
        <div className="absolute left-[16px] top-[7px] z-30">
          <img src={appIcon} alt="App Icon" className="w-9 h-9" />
        </div>
        
        {/* Right side with status indicator and window controls - adjusted to avoid overlap */}
        <div className="flex items-center h-full relative top-[-4px]" data-tauri-drag-region>
          {/* Status indicator with border and rounded corners */}
          <div className="flex items-center border border-[#333] rounded-full px-3 py-1 mr-2 bg-[#0a0a0a]" data-tauri-drag-region>
            <span className="w-2 h-2 rounded-full bg-gray-400 mr-2" data-tauri-drag-region></span>
            <span className="text-sm text-gray-300 antialiased" data-tauri-drag-region>No instances running</span>
          </div>
          
          {/* Window controls with subtle hover effects and smoother transitions */}
          <div className="flex no-drag">
            <button 
              className="w-10 h-10 flex items-center justify-center hover:bg-[#131313] active:scale-95 active:translate-y-[1px] text-gray-400 rounded-full mx-1 transition-all no-drag"
              onClick={() => appWindow.minimize()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <button 
              className="w-10 h-10 flex items-center justify-center hover:bg-[#131313] active:scale-95 active:translate-y-[1px] text-gray-400 rounded-full mx-1 transition-all no-drag"
              onClick={() => appWindow.toggleMaximize()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              </svg>
            </button>
            <button 
              className="w-10 h-10 flex items-center justify-center hover:bg-[#ff0000] active:scale-95 active:translate-y-[1px] active:bg-[#cc0000] text-gray-400 hover:text-white rounded-full mx-1 transition-all no-drag"
              onClick={() => appWindow.close()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Layout Container */}
      <div className="flex w-full h-full">
        {/* Sidebar - width 70px - no border and lower than titlebar */}
        <aside 
          className="w-[70px] h-full bg-[#0a0a0a] pt-[55px] z-10 flex flex-col"
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
              className="w-12 h-12 flex items-center justify-center hover:bg-[#131313] active:scale-95 active:translate-y-[1px] text-gray-300 hover:text-white rounded-full transition-all absolute"
              style={{ left: `${buttonLeftPosition}px` }}
              onClick={() => setShowSettings(true)}
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

        {/* Main container with rounded top-left corner overlapping titlebar and sidebar */}
        <div 
          className="absolute z-20"
          style={{ 
            top: `${titlebarHeight - overlapAmount}px`, 
            left: `${sidebarWidth - overlapAmount}px`,
            right: '0',
            bottom: '0'
          }}
        >
          <main className="w-full h-full bg-black rounded-tl-[24px] p-4 text-white overflow-auto border-t border-l border-[#222]">
          </main>
        </div>
      </div>
      
      {/* Settings Modal */}
      {showSettings && (
        <>
          {/* Backdrop with blur effect with strong filters to ensure blur works */}
          <div 
            className="fixed inset-0 z-40"
            style={{
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              backgroundColor: 'rgba(20, 17, 0, 0.55)'
            }}
            onClick={() => setShowSettings(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[550px] bg-[#0a0a0a] rounded-2xl shadow-xl z-50 overflow-hidden border border-[#333] flex flex-col">
            {/* Modal Titlebar */}
            <div className="h-[60px] w-full bg-[#0a0a0a] px-4 flex items-center justify-between border-b border-[#333]">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth="1.5" viewBox="0 0 24 24" className="text-gray-300 mr-3">
                  <circle cx="12" cy="12" r="3" />
                  <path
                    d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                </svg>
                <h2 className="text-xl font-medium text-white">Settings</h2>
              </div>
              
              {/* Close button */}
              <button 
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#1a1a1a] transition-colors text-gray-400"
                onClick={() => setShowSettings(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            {/* Modal Content Area */}
            <div className="flex flex-1 bg-[#0a0a0a]">
              {/* Left area - no interactive elements */}
              <div className="w-[260px] h-full flex flex-col">
                {/* Empty space where buttons would be */}
                <div className="flex-1 overflow-y-auto pt-4">
                </div>
                
                {/* App Info - no top border */}
                <div className="p-5 flex items-center">
                  <div className="flex items-center">
                    <img src={appIcon} alt="App Icon" className="w-8 h-8 mr-3" />
                    <div>
                      <p className="text-gray-400 text-sm font-medium">brew App 0.0.4</p>
                      <p className="text-gray-400 text-xs">Linux {systemInfo.version}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Content Area - completely empty */}
              <div className="flex-1 bg-[#0a0a0a] relative">
                {/* Vertical separator line - taller and better positioned */}
                <div className="absolute left-0 top-[10%] bottom-[10%] w-[1px] bg-[#333]"></div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
