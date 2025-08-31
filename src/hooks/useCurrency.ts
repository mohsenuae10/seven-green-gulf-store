import { useState, useEffect } from 'react';

export type Currency = 'AED' | 'SAR' | 'USD';

interface CurrencyData {
  code: Currency;
  symbol: string;
  name: string;
  flag: string;
  rate: number; // Exchange rate relative to AED
}

const currencies: Record<Currency, CurrencyData> = {
  AED: { code: 'AED', symbol: 'درهم', name: 'درهم إماراتي', flag: '🇦🇪', rate: 1 },
  SAR: { code: 'SAR', symbol: 'ريال', name: 'ريال سعودي', flag: '🇸🇦', rate: 1.02 }, // 1 AED = ~1.02 SAR
  USD: { code: 'USD', symbol: '$', name: 'دولار أمريكي', flag: '🇺🇸', rate: 0.27 }, // 1 AED = ~0.27 USD
};

export function useCurrency() {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('AED');

  // Load currency from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('selectedCurrency') as Currency;
    if (saved && currencies[saved]) {
      setSelectedCurrency(saved);
    }
  }, []);

  // Save currency to localStorage when changed
  useEffect(() => {
    localStorage.setItem('selectedCurrency', selectedCurrency);
  }, [selectedCurrency]);

  const convertPrice = (priceInAED: number): number => {
    const rate = currencies[selectedCurrency].rate;
    return Math.round(priceInAED * rate);
  };

  const formatPrice = (priceInAED: number): string => {
    const convertedPrice = convertPrice(priceInAED);
    const currency = currencies[selectedCurrency];
    
    if (selectedCurrency === 'USD') {
      return `$${convertedPrice}`;
    }
    return `${convertedPrice} ${currency.symbol}`;
  };

  const getCurrencyData = (currency: Currency) => currencies[currency];
  const getCurrentCurrency = () => currencies[selectedCurrency];
  const getAllCurrencies = () => Object.values(currencies);

  return {
    selectedCurrency,
    setSelectedCurrency,
    convertPrice,
    formatPrice,
    getCurrencyData,
    getCurrentCurrency,
    getAllCurrencies,
  };
}