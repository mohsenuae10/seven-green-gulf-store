import { Currency } from "@/hooks/useCurrency";

interface PriceDisplayProps {
  amount: number;
  currency: Currency;
  className?: string;
}

export const PriceDisplay = ({ amount, currency, className = "" }: PriceDisplayProps) => {
  
  if (currency === 'SAR') {
    return (
      <span className={`inline-flex items-baseline gap-1 ${className}`}>
        <span className="tabular-nums" style={{ fontWeight: 300 }}>{amount}</span>
        <img
          src="/images/sar-symbol.svg"
          alt="ريال سعودي"
          className="inline-block w-4 h-4 self-center"
          style={{ verticalAlign: 'middle' }}
        />
      </span>
    );
  }

  if (currency === 'USD') {
    return (
      <span className={`inline-flex items-baseline ${className}`}>
        <span className="text-[0.55em] opacity-70 mr-0.5" style={{ fontWeight: 300 }}>$</span>
        <span className="tabular-nums" style={{ fontWeight: 300 }}>{amount}</span>
      </span>
    );
  }

  // AED
  return (
    <span className={`inline-flex items-baseline gap-1 ${className}`}>
      <span className="tabular-nums" style={{ fontWeight: 300 }}>{amount}</span>
      <span className="text-[0.55em] opacity-70" style={{ fontWeight: 300 }}>د.إ</span>
    </span>
  );
};
