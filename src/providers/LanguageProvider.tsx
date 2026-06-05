import React, { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Language, LanguageContext, translations } from '@/hooks/useLanguage';

interface LanguageProviderProps {
  children: React.ReactNode;
}

const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const location  = useLocation();
  const navigate  = useNavigate();

  // Language is derived 100% from URL — no localStorage needed
  const language: Language = location.pathname.startsWith('/en') ? 'en' : 'ar';

  const setLanguage = useCallback((lang: Language) => {
    const current = location.pathname;
    const search  = location.search;

    if (lang === 'en' && !current.startsWith('/en')) {
      // ar → en: prepend /en
      const enPath = `/en${current === '/' ? '' : current}`;
      navigate(enPath + search, { replace: false });
    } else if (lang === 'ar' && current.startsWith('/en')) {
      // en → ar: strip /en prefix
      const arPath = current.replace(/^\/en/, '') || '/';
      navigate(arPath + search, { replace: false });
    }
  }, [location, navigate]);

  const t = useCallback((key: string): string => {
    return translations[language]?.[key] ?? key;
  }, [language]);

  // Update document direction + lang attribute
  React.useEffect(() => {
    document.documentElement.lang = language === 'ar' ? 'ar' : 'en';
    document.documentElement.dir  = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
