import React from 'react';

interface PrivacySettingsProps {
  themeClasses: {
    background: string;
    secondaryBackground: string;
    cardBackground: string;
    text: string;
    secondaryText: string;
    border: string;
  };
  t: (key: string, defaultValue?: string) => string;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({
  themeClasses,
  t
}) => {
  return (
    <div className="h-[400px] overflow-y-auto pr-2">
      <h3 className={`text-xl ${themeClasses.text} font-medium mb-4`}>{t('settings.tab.privacy', 'Privacy Settings')}</h3>
      
      {/* Discord RPC setting with toggle - Grayed out with "In Development" label */}
      <div className={`mt-6 relative overflow-hidden ${themeClasses.cardBackground} p-4 rounded-lg border ${themeClasses.border} transition-all duration-500`}>
        {/* Semi-transparent overlay with blur */}
        <div className="absolute inset-0 bg-gray-800 bg-opacity-20 backdrop-filter backdrop-blur-[3px] z-10"></div>
        
        {/* "In Development" diagonal overlay */}
        <div className="absolute inset-0 overflow-hidden flex items-center justify-center pointer-events-none z-20">
          <div className="transform rotate-[-32deg] translate-y-[-2px]">
            <span className="text-white text-[28px] font-bold tracking-[2px] whitespace-nowrap" style={{ 
              textShadow: '0px 2px 8px rgba(0,0,0,0.5)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,204,64,0.8) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              В РАЗРАБОТКЕ
            </span>
          </div>
        </div>

        <div className="flex-1 pr-4 relative z-0">
          <h4 className={`${themeClasses.text} font-medium mb-1`}>{t('settings.privacy.discord_rpc', 'Discord RPC')}</h4>
          <p className={`${themeClasses.secondaryText} text-sm`}>
            {t('settings.privacy.discord_rpc.description', 'Manages the Discord Rich Presence integration. Disabling this will cause \'Modrinth\' to no longer show up as a game or app you are using on your Discord profile.')}
          </p>
          <p className="text-gray-500 text-sm mt-2 italic">
            {t('settings.privacy.discord_rpc.note', 'Note: This will not prevent any instance-specific Discord Rich Presence integrations, such as those added by mods. (app restart required to take effect)')}
          </p>
        </div>
        
        {/* Toggle switch - disabled with better styling */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-0">
          <div className="inline-flex items-center opacity-70">
            <div className="relative">
              <div className="w-11 h-6 rounded-full bg-gray-600 shadow-inner"></div>
              <div className="absolute top-[2px] left-[2px] w-5 h-5 rounded-full bg-gray-400 shadow-md"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings; 