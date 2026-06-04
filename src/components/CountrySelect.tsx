import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import { countries, Country } from "@/data/countries";
import { useLanguage } from "@/hooks/useLanguage";

interface CountrySelectProps {
  value: string;
  onChange: (country: Country) => void;
  placeholder?: string;
  className?: string;
  phoneCodeOnly?: boolean;
}

const CountrySelect = ({ value, onChange, placeholder, className = "", phoneCodeOnly = false }: CountrySelectProps) => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = countries.find(c => c.code === value);

  const filtered = search.trim()
    ? countries.filter(c =>
        c.nameAr.includes(search) ||
        c.nameEn.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase())
      )
    : countries;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleSelect = (country: Country) => {
    onChange(country);
    setOpen(false);
    setSearch("");
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className={`
          w-full flex items-center gap-2 px-3 py-2 h-10
          border border-input rounded-md bg-background text-sm
          hover:bg-accent/30 transition-colors
          focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
          ${language === 'ar' ? 'text-right flex-row-reverse' : 'text-left'}
        `}
      >
        {selected ? (
          phoneCodeOnly ? (
            <>
              <span className="text-lg leading-none">{selected.flag}</span>
              <span className="flex-1 truncate font-mono">{selected.phoneCode}</span>
            </>
          ) : (
            <>
              <span className="text-lg leading-none">{selected.flag}</span>
              <span className="flex-1 truncate">
                {language === 'ar' ? selected.nameAr : selected.nameEn}
              </span>
            </>
          )
        ) : (
          <span className="flex-1 text-muted-foreground truncate">
            {placeholder ?? (language === 'ar' ? 'اختر الدولة' : 'Select country')}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-background border border-border rounded-md shadow-lg overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={language === 'ar' ? 'ابحث بالعربي أو الإنجليزي...' : 'Search in Arabic or English...'}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              dir="auto"
            />
            {search && (
              <button type="button" onClick={() => setSearch("")}>
                <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          {/* Country list */}
          <div className="max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {language === 'ar' ? 'لا توجد نتائج' : 'No results found'}
              </div>
            ) : (
              filtered.map(country => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleSelect(country)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 text-sm
                    hover:bg-accent transition-colors
                    ${country.code === value ? 'bg-primary/10 font-medium' : ''}
                    ${language === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}
                  `}
                >
                  <span className="text-lg leading-none shrink-0">{country.flag}</span>
                  <span className="flex-1 truncate">
                    {language === 'ar' ? country.nameAr : country.nameEn}
                  </span>
                  <span className="text-muted-foreground text-xs shrink-0">
                    {language === 'ar' ? country.nameEn : country.nameAr}
                  </span>
                  <span className="text-muted-foreground text-xs shrink-0 font-mono">
                    {country.phoneCode}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelect;
