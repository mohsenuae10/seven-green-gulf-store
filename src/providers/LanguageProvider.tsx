import React, { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Language, LanguageContext, translations } from '@/hooks/useLanguage';

interface LanguageProviderProps {
  children: React.ReactNode;
}

const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // English is default (/) — Arabic uses /ar/ prefix
  const language: Language = location.pathname.startsWith('/ar') ? 'ar' : 'en';

  const setLanguage = useCallback((lang: Language) => {
    const current = location.pathname;
    const search  = location.search;

    if (lang === 'ar' && !current.startsWith('/ar')) {
      // en → ar: prepend /ar
      const arPath = `/ar${current === '/' ? '' : current}`;
      navigate(arPath + search, { replace: false });
    } else if (lang === 'en' && current.startsWith('/ar')) {
      // ar → en: strip /ar prefix
      const enPath = current.replace(/^\/ar/, '') || '/';
      navigate(enPath + search, { replace: false });
    }
  }, [location, navigate]);

  const t = useCallback((key: string): string => {
    return translations[language]?.[key] ?? key;
  }, [language]);

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
