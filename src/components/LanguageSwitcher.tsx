import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-0.5 bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm rounded-full p-0.5 border border-primary/20 shadow-soft hover:border-primary/30 transition-all duration-300">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setLanguage('ar')}
        className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-300 ${
          language === 'ar' 
            ? 'bg-gradient-primary text-white shadow-elegant scale-105' 
            : 'text-muted-foreground hover:bg-primary/10 hover:text-primary hover:scale-105'
        }`}
      >
        عربي
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setLanguage('en')}
        className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-300 ${
          language === 'en' 
            ? 'bg-gradient-primary text-white shadow-elegant scale-105' 
            : 'text-muted-foreground hover:bg-primary/10 hover:text-primary hover:scale-105'
        }`}
      >
        EN
      </Button>
    </div>
  );
};

export default LanguageSwitcher;