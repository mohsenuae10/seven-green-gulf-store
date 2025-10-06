import { Currency } from "@/hooks/useCurrency";

interface PriceDisplayProps {
  amount: number;
  currency: Currency;
  className?: string;
  showStrikethrough?: boolean;
}

export const PriceDisplay = ({ amount, currency, className = "", showStrikethrough = false }: PriceDisplayProps) => {
  const baseClass = showStrikethrough ? "line-through" : "";
  
  if (currency === 'SAR') {
    return (
      <span className={`inline-flex items-center gap-1 ${baseClass} ${className}`}>
        <span>{amount}</span>
        <img 
          src="/images/sar-symbol.svg" 
          alt="ريال سعودي" 
          className="inline-block w-4 h-4"
          style={{ verticalAlign: 'middle' }}
        />
      </span>
    );
  }
  
  if (currency === 'USD') {
    return <span className={`${baseClass} ${className}`}>${amount}</span>;
  }
  
  // AED
  return <span className={`${baseClass} ${className}`}>{amount} د.إ</span>;
};
