import { useState, useEffect } from 'react';

export type Currency = 'AED' | 'SAR' | 'USD';

interface CurrencyData {
  code: Currency;
  symbol: string;
  name: string;
  flag: string;
  rate: number; // Exchange rate relative to SAR
}

const currencies: Record<Currency, CurrencyData> = {
  SAR: { code: 'SAR', symbol: '﷼', name: 'ريال سعودي', flag: '🇸🇦', rate: 1 }, // Base currency
  AED: { code: 'AED', symbol: 'د.إ', name: 'درهم إماراتي', flag: '🇦🇪', rate: 0.98 }, // 1 SAR = ~0.98 AED
  USD: { code: 'USD', symbol: '$', name: 'دولار أمريكي', flag: '🇺🇸', rate: 0.27 }, // 1 SAR = ~0.27 USD
};

export function useCurrency() {
  const [selectedCurrency, setSelectedCurrencyState] = useState<Currency>('SAR');

  // Load currency from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('selectedCurrency') as Currency;
    if (saved && currencies[saved]) {
      setSelectedCurrencyState(saved);
    }
  }, []);

  // Listen for currency change events across app
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as Currency;
      if (detail && currencies[detail]) {
        setSelectedCurrencyState(detail);
      }
    };
    window.addEventListener('currencychange' as any, handler as any);
    return () => window.removeEventListener('currencychange' as any, handler as any);
  }, []);

  // Save currency to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem('selectedCurrency', selectedCurrency);
    } catch {}
  }, [selectedCurrency]);

  const convertPrice = (priceInSAR: number): number => {
    const rate = currencies[selectedCurrency].rate;
    return Math.round(priceInSAR * rate);
  };

  const formatPrice = (priceInSAR: number): string => {
    const convertedPrice = convertPrice(priceInSAR);
    const currency = currencies[selectedCurrency];
    
    if (selectedCurrency === 'USD') {
      return `$${convertedPrice}`;
    }
    return `${convertedPrice} ${currency.symbol}`;
  };

  const getCurrencyData = (currency: Currency) => currencies[currency];
  const getCurrentCurrency = () => currencies[selectedCurrency];
  const getAllCurrencies = () => Object.values(currencies);

  const changeCurrency = (code: Currency) => {
    setSelectedCurrencyState(code);
    try {
      localStorage.setItem('selectedCurrency', code);
    } catch {}
    window.dispatchEvent(new CustomEvent('currencychange', { detail: code }));
  };
  return {
    selectedCurrency,
    changeCurrency,
    convertPrice,
    formatPrice,
    getCurrencyData,
    getCurrentCurrency,
    getAllCurrencies,
  };
}