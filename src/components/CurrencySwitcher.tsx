import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useCurrency, Currency } from "@/hooks/useCurrency";
import { Button } from "@/components/ui/button";

interface CurrencySwitcherProps {
  className?: string;
  variant?: "header" | "inline";
}

const CurrencySwitcher = ({ className = "", variant = "header" }: CurrencySwitcherProps) => {
  const { selectedCurrency, changeCurrency, getAllCurrencies, getCurrentCurrency } = useCurrency();
  const currencies = getAllCurrencies();
  const currentCurrency = getCurrentCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (variant === "inline") {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {currencies.map((currency) => (
          <Button
            key={currency.code}
            variant={selectedCurrency === currency.code ? "default" : "outline"}
            size="sm"
            onClick={() => changeCurrency(currency.code)}
            className="h-8 px-2 text-xs"
          >
            <span className="mr-1">{currency.flag}</span>
            {currency.code}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-1 px-1 py-0.5 rounded-full text-xs font-semibold text-gray-600 hover:text-primary transition-colors"
      >
        <span className="text-sm leading-none">{currentCurrency.flag}</span>
        <span className="font-bold">{currentCurrency.code}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50 min-w-[130px]">
          {currencies.map((currency) => (
            <button
              key={currency.code}
              onClick={() => { changeCurrency(currency.code as Currency); setOpen(false); }}
              className={`
                w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors text-left
                ${selectedCurrency === currency.code
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <span className="text-base leading-none">{currency.flag}</span>
              <div>
                <div className="font-bold">{currency.code}</div>
                <div className="text-[10px] text-gray-400">{currency.name}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencySwitcher;
