import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
      <Button
        size="sm"
        variant={language === 'ar' ? 'default' : 'ghost'}
        onClick={() => setLanguage('ar')}
        className={`rounded-full px-3 py-1 text-xs transition-all ${
          language === 'ar' 
            ? 'bg-white text-primary shadow-sm' 
            : 'text-white hover:bg-white/10'
        }`}
      >
        ع
      </Button>
      <Button
        size="sm"
        variant={language === 'en' ? 'default' : 'ghost'}
        onClick={() => setLanguage('en')}
        className={`rounded-full px-3 py-1 text-xs transition-all ${
          language === 'en' 
            ? 'bg-white text-primary shadow-sm' 
            : 'text-white hover:bg-white/10'
        }`}
      >
        EN
      </Button>
    </div>
  );
};

export default LanguageSwitcher;