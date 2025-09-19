import React from 'react';
import { LanguageContext, useLanguageHook } from '@/hooks/useLanguage';

interface LanguageProviderProps {
  children: React.ReactNode;
}

const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { language, setLanguage, t } = useLanguageHook();

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;