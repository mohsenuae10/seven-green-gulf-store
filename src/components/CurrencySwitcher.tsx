import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCurrency, Currency } from "@/hooks/useCurrency";

interface CurrencySwitcherProps {
  className?: string;
  variant?: "header" | "inline";
}

const CurrencySwitcher = ({ className = "", variant = "header" }: CurrencySwitcherProps) => {
  const { selectedCurrency, changeCurrency, getAllCurrencies, getCurrentCurrency } = useCurrency();
  const currencies = getAllCurrencies();
  const currentCurrency = getCurrentCurrency();

  if (variant === "header") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Select
          value={selectedCurrency}
          onValueChange={(value: Currency) => changeCurrency(value)}
        >
          <SelectTrigger className="w-[140px] bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 text-foreground hover:bg-primary/15 hover:border-primary/30 transition-all duration-300 backdrop-blur-sm shadow-soft rounded-full font-semibold">
            <SelectValue>
              <div className="flex items-center gap-2">
                <span className="text-lg">{currentCurrency.flag}</span>
                <span className="font-bold text-sm">{currentCurrency.code}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-background/95 backdrop-blur-md border-2 border-primary/20 shadow-elegant rounded-xl z-50 overflow-hidden">
            {currencies.map((currency) => (
              <SelectItem 
                key={currency.code} 
                value={currency.code}
                className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer transition-all duration-200 rounded-lg mx-1 my-0.5"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{currency.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">{currency.code}</span>
                    <span className="text-xs text-muted-foreground">{currency.name}</span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

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
};

export default CurrencySwitcher;