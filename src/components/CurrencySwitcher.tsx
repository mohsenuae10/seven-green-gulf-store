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
          <SelectTrigger className="w-[120px] bg-primary/10 border-primary/30 text-foreground hover:bg-primary/20 transition-all duration-300 backdrop-blur-sm">
            <SelectValue>
              <div className="flex items-center gap-2">
                <span>{currentCurrency.flag}</span>
                <span className="font-medium">{currentCurrency.code}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-background border border-border shadow-lg z-50">
            {currencies.map((currency) => (
              <SelectItem 
                key={currency.code} 
                value={currency.code}
                className="hover:bg-muted"
              >
                <div className="flex items-center gap-2">
                  <span>{currency.flag}</span>
                  <span className="font-medium">{currency.code}</span>
                  <span className="text-sm text-muted-foreground">{currency.name}</span>
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