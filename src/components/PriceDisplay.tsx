import { Currency } from "@/hooks/useCurrency";

interface PriceDisplayProps {
  amount: number;
  currency: Currency;
  className?: string;
}

export const PriceDisplay = ({ amount, currency, className = "" }: PriceDisplayProps) => {
  
  if (currency === 'SAR') {
    return (
      <span className={`inline-flex items-center gap-1 ${className}`}>
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
    return <span className={className}>${amount}</span>;
  }
  
  // AED
  return <span className={className}>{amount} د.إ</span>;
};
