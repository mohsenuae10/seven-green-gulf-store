import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-primary/10 backdrop-blur-sm rounded-full p-1 border border-primary/30">
      <Button
        size="sm"
        variant={language === 'ar' ? 'default' : 'ghost'}
        onClick={() => setLanguage('ar')}
        className={`rounded-full px-3 py-1 text-xs transition-all ${
          language === 'ar' 
            ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90' 
            : 'text-foreground/70 hover:bg-primary/20 hover:text-foreground'
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
            ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90' 
            : 'text-foreground/70 hover:bg-primary/20 hover:text-foreground'
        }`}
      >
        EN
      </Button>
    </div>
  );
};

export default LanguageSwitcher;