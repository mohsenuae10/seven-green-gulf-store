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
  SAR: { code: 'SAR', symbol: 'ريال', name: 'ريال سعودي', flag: '🇸🇦', rate: 1 }, // Base currency - رمز الريال الجديد
  AED: { code: 'AED', symbol: 'د.إ', name: 'درهم إماراتي', flag: '🇦🇪', rate: 0.98 }, // 1 SAR = ~0.98 AED
  USD: { code: 'USD', symbol: '$', name: 'دولار أمريكي', flag: '🇺🇸', rate: 0.27 }, // 1 SAR = ~0.27 USD
};

// Customers are always charged in SAR, so SAR is the default display currency.
// A new storage key is used on purpose: the old 'selectedCurrency' key was
// auto-written as 'USD' for every visitor (not a real choice), so it is ignored.
const STORAGE_KEY = 'sg_currency';

const readSavedCurrency = (): Currency => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Currency | null;
    if (saved && currencies[saved]) return saved;
  } catch {
    // storage unavailable
  }
  return 'SAR';
};

export function useCurrency() {
  const [selectedCurrency, setSelectedCurrencyState] = useState<Currency>(readSavedCurrency);

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

  const getPriceData = (priceInSAR: number) => {
    return {
      amount: convertPrice(priceInSAR),
      currency: selectedCurrency,
    };
  };

  const getCurrencyData = (currency: Currency) => currencies[currency];
  const getCurrentCurrency = () => currencies[selectedCurrency];
  const getAllCurrencies = () => Object.values(currencies);

  const changeCurrency = (code: Currency) => {
    setSelectedCurrencyState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {}
    window.dispatchEvent(new CustomEvent('currencychange', { detail: code }));
  };
  return {
    selectedCurrency,
    changeCurrency,
    convertPrice,
    formatPrice,
    getPriceData,
    getCurrencyData,
    getCurrentCurrency,
    getAllCurrencies,
  };
}