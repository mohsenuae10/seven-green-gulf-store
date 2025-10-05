import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  const { language } = useLanguage();

  return (
    <nav className="container mx-auto px-4 py-4" aria-label="breadcrumb">
      <ol className="flex items-center gap-2 text-sm flex-wrap">
        <li>
          <Link 
            to="/" 
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            aria-label={language === 'ar' ? 'الرئيسية' : 'Home'}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'ar' ? 'الرئيسية' : 'Home'}</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            {item.href ? (
              <Link 
                to={item.href} 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
