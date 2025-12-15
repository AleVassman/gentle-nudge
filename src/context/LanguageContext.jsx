import { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../locales';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // 1. Load saved language or default to English
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('gentle_lang') || 'en';
  });

  // 2. Save language when it changes
  useEffect(() => {
    localStorage.setItem('gentle_lang', language);
  }, [language]);

  // 3. The Translation Function (The Magic)
  // Usage: t('common.wins') -> returns "Vittorie"
  const t = (path) => {
    const keys = path.split('.'); // Split "common.wins" into ["common", "wins"]
    let current = translations[language];

    for (let key of keys) {
      if (current[key] === undefined) {
        console.warn(`Missing translation: ${path}`);
        return path; // Return the key itself if translation is missing
      }
      current = current[key];
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use it easily in other files
export const useLanguage = () => useContext(LanguageContext);