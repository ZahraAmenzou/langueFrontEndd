export const LANGUAGES = {
  tachelhit: {
    code: 'tachelhit',
    label: 'Tachelhit',
    nativeName: 'Tachelhit',
    bcp47: 'zgh',
    flag: '🌐',
  },
  arabic: {
    code: 'arabic',
    label: 'Arabic',
    nativeName: 'العربية',
    bcp47: 'ar',
    flag: '🇲🇦',
  },
  french: {
    code: 'french',
    label: 'French',
    nativeName: 'Français',
    bcp47: 'fr',
    flag: '🇫🇷',
  },
  english: {
    code: 'english',
    label: 'English',
    nativeName: 'English',
    bcp47: 'en',
    flag: '🇬🇧',
  },
  german: {
    code: 'german',
    label: 'German',
    nativeName: 'Deutsch',
    bcp47: 'de',
    flag: '🇩🇪',
  },
};

export const LANGUAGE_CODES = Object.keys(LANGUAGES);
export const DEFAULT_LANGUAGE = 'tachelhit';

export const getLanguage = (code) => LANGUAGES[code] || LANGUAGES[DEFAULT_LANGUAGE];
