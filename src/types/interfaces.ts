// Application-wide interfaces

export interface ThemeClasses {
  background: string;
  secondaryBackground: string;
  cardBackground: string;
  text: string;
  secondaryText: string;
  border: string;
}

export interface Settings {
  theme: string;
  discord_rpc: boolean;
  advanced_rendering: boolean;
  language: string;
  titlebar_style: string;
}

export interface LanguageMetadata {
  id: string;
  version: string;
  author: string;
}

export interface Language {
  metadata: LanguageMetadata;
  [key: string]: string | LanguageMetadata;
} 