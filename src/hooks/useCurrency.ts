import { useState, useEffect } from 'react';

export type Currency = 'AED' | 'SAR' | 'USD' | 'EUR' | 'GBP';

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
  // Fixed display rates (checked Nov 2026). Customers are always CHARGED in SAR,
  // so converted prices are approximate and the checkout says so.
  EUR: { code: 'EUR', symbol: '€', name: 'يورو', flag: '🇪🇺', rate: 0.238 }, // 1 SAR = ~0.238 EUR
  GBP: { code: 'GBP', symbol: '£', name: 'جنيه إسترليني', flag: '🇬🇧', rate: 0.198 }, // 1 SAR = ~0.198 GBP
};

// Only a choice the customer made in the currency switcher is stored here.
// A new storage key is used on purpose: the old 'selectedCurrency' key was
// auto-written as 'USD' for every visitor (not a real choice), so it is ignored.
const STORAGE_KEY = 'sg_currency';

const GBP_ZONES = new Set(['Europe/London', 'Europe/Belfast', 'Europe/Jersey', 'Europe/Guernsey', 'Europe/Isle_of_Man']);
const EUR_ZONES_OUTSIDE_EUROPE_PREFIX = new Set(['Atlantic/Canary', 'Atlantic/Madeira', 'Atlantic/Azores', 'Asia/Nicosia']);
const NON_EUR_EUROPE_ZONES = new Set([
  'Europe/Moscow', 'Europe/Minsk', 'Europe/Istanbul', 'Europe/Kyiv', 'Europe/Kiev', 'Europe/Simferopol',
  'Europe/Kaliningrad', 'Europe/Samara', 'Europe/Volgograd', 'Europe/Saratov', 'Europe/Ulyanovsk',
  'Europe/Astrakhan', 'Europe/Kirov', 'Europe/Chisinau', 'Europe/Tiraspol', 'Europe/Uzhgorod', 'Europe/Zaporozhye',
]);

/** Saudi Arabia → SAR, UAE → AED, UK → GBP, Europe → EUR, everyone else → USD. */
export const currencyForTimeZone = (timeZone: string): Currency => {
  if (timeZone === 'Asia/Riyadh') return 'SAR';
  if (timeZone === 'Asia/Dubai') return 'AED';
  if (GBP_ZONES.has(timeZone)) return 'GBP';
  if (EUR_ZONES_OUTSIDE_EUROPE_PREFIX.has(timeZone)) return 'EUR';
  if (timeZone.startsWith('Europe/') && !NON_EUR_EUROPE_ZONES.has(timeZone)) return 'EUR';
  return 'USD';
};

// The device time zone identifies the customer's country instantly: no network
// request, so prices never jump from one currency to another after the page loads.
const detectCurrency = (): Currency => {
  try {
    return currencyForTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone || '');
  } catch {
    return 'USD';
  }
};

const initialCurrency = (): Currency => {
  // Prices, orders and revenue are stored in SAR: the admin panel never converts them.
  if (window.location.pathname.startsWith('/admin')) return 'SAR';
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Currency | null;
    if (saved && currencies[saved]) return saved;
  } catch {
    // storage unavailable
  }
  return detectCurrency();
};

export function useCurrency() {
  const [selectedCurrency, setSelectedCurrencyState] = useState<Currency>(initialCurrency);

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
    
    if (selectedCurrency === 'USD' || selectedCurrency === 'EUR' || selectedCurrency === 'GBP') {
      return `${currency.symbol}${convertedPrice}`;
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