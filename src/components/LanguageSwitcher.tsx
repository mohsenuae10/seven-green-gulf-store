import { useLanguage } from "@/hooks/useLanguage";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-0.5 bg-gray-100 rounded-full p-0.5">
      <button
        onClick={() => setLanguage('ar')}
        className={`
          px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all duration-200
          ${language === 'ar'
            ? 'bg-white text-primary shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
          }
        `}
        aria-label="Arabic"
      >
        ع
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`
          px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all duration-200 font-english
          ${language === 'en'
            ? 'bg-white text-primary shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
          }
        `}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
