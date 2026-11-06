import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";

// TypeScript declaration for gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
import { useCurrency } from "@/hooks/useCurrency";
import { useLanguage, useLangPath } from "@/hooks/useLanguage";
import { useCart, type CartItem } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Phone, Flag, ChevronRight, Shield, Truck, RotateCcw, Lock, Minus, Plus, Trash2 } from "lucide-react";
import { useStoreTheme } from "@/hooks/useStoreTheme";
import MobileNav from "@/components/MobileNav";
import MobileOptimized from "@/components/MobileOptimized";
import PaymentMethods from "@/components/PaymentMethods";
import TrustBadges from "@/components/TrustBadges";
import { PriceDisplay } from "@/components/PriceDisplay";
import { supabase } from "@/integrations/supabase/client";
import StripePaymentForm, { type ExpressDetails, type PreparedPayment } from "@/components/checkout/StripePaymentForm";
import { trackInitiateCheckout } from "@/lib/metaPixel";
import { readCheckoutSession, writeCheckoutSession, clearCheckoutSession } from "@/lib/checkoutSession";
import Header from "@/components/Header";
import CountrySelect from "@/components/CountrySelect";
import { countries } from "@/data/countries";

const FALLBACK_IMAGE = "/images/sevengreen-logo.webp";

/** How many digits the customer typed in the local phone field (leading zeros ignored). */
const localPhoneDigits = (local: string) => local.replace(/\D/g, "").replace(/^0+/, "").length;

/** "050 123 4567" + "+966" -> "+966501234567". Accepts a full "+966…" / "00966…" number too. */
const toInternationalPhone = (local: string, dialCode: string): string => {
  const raw = local.trim();
  if (raw.startsWith("+")) return `+${raw.replace(/\D/g, "")}`;
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  const code = dialCode.replace(/\D/g, "");
  const national = digits.replace(/^0+/, "");
  return code && national ? `+${code}${national}` : "";
};

/** Wallet phones can be local ("0501234567") or international ("+966 50 123 4567"). */
const walletPhone = (raw: string | undefined, countryCode: string | undefined): string => {
  if (!raw) return "";
  const dial = countries.find((c) => c.code === countryCode)?.phoneCode ?? "";
  return toInternationalPhone(raw, dial);
};

const formatSar = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2));

/** One-tap city buttons for the "simple" checkout theme: [Arabic, English]. */
const QUICK_CITIES: Record<string, [string, string][]> = {
  SA: [["الرياض", "Riyadh"], ["جدة", "Jeddah"], ["الدمام", "Dammam"], ["مكة", "Makkah"], ["المدينة", "Madinah"]],
  AE: [["دبي", "Dubai"], ["أبوظبي", "Abu Dhabi"], ["الشارقة", "Sharjah"], ["عجمان", "Ajman"], ["العين", "Al Ain"]],
  KW: [["مدينة الكويت", "Kuwait City"], ["حولي", "Hawalli"], ["الفروانية", "Farwaniya"], ["الأحمدي", "Ahmadi"], ["الجهراء", "Jahra"]],
  QA: [["الدوحة", "Doha"], ["الريان", "Al Rayyan"], ["الوكرة", "Al Wakrah"], ["الخور", "Al Khor"]],
  BH: [["المنامة", "Manama"], ["المحرق", "Muharraq"], ["الرفاع", "Riffa"], ["مدينة حمد", "Hamad Town"]],
  OM: [["مسقط", "Muscat"], ["صلالة", "Salalah"], ["صحار", "Sohar"], ["نزوى", "Nizwa"]],
};

/** Supabase hides the response body for non-2xx replies; read it from the error context. */
const readFunctionError = async (err: unknown): Promise<string | undefined> => {
  try {
    const ctx = (err as { context?: Response })?.context;
    if (ctx && typeof ctx.json === "function") {
      const body = await ctx.json();
      return typeof body?.error === "string" ? body.error : undefined;
    }
  } catch {
    // ignore
  }
  return undefined;
};

const ERROR_MESSAGES_EN: Record<string, string> = {
  empty_cart: "Your cart is empty",
  invalid_phone: "Please enter a valid phone number",
  incomplete_details: "Please complete your delivery details",
  product_unavailable: "Some products are no longer available",
  already_paid: "This order has already been paid",
  previous_payment_in_progress: "A previous payment is still being processed. Please wait a moment and try again.",
  server_error: "Could not prepare the payment. Please try again.",
};

const Order = () => {
  const { language, t } = useLanguage();
  const isAr = language === "ar";
  const langPath = useLangPath();
  const { items, updateQty, removeItem, totalPrice, replaceCart } = useCart();
  const { getPriceData, selectedCurrency, formatPrice } = useCurrency();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const resumeId = searchParams.get("id");
  const resumeToken = searchParams.get("t");

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    country: "",
    countryCode: "",
    city: "",
    address: "",
  });
  const [detectingCountry, setDetectingCountry] = useState(true);
  const [restoring, setRestoring] = useState(!!(resumeId && resumeToken));
  const [processing, setProcessing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const storeTheme = useStoreTheme();
  // "simple" theme only
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);

  // Serialises autosaves so two quick changes can never create two orders.
  const saveChainRef = useRef<Promise<void>>(Promise.resolve());
  const lastSavedRef = useRef("");

  const cartItemsPayload = useMemo(
    () => items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    [items]
  );
  const amountMinor = Math.round(totalPrice * 100);

  const focusNext = (ref: React.RefObject<HTMLInputElement>) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      ref.current?.focus();
    }
  };

  // ── Resume an order from the reminder-email link (/order?id=…&t=…) ─────────
  useEffect(() => {
    if (!resumeId || !resumeToken) return;
    (async () => {
      try {
        const { data } = await supabase.functions.invoke("checkout-session", {
          body: { action: "load", orderId: resumeId, checkoutToken: resumeToken },
        });
        if (data?.success && data.paid) {
          clearCheckoutSession();
          toast({ title: isAr ? "هذا الطلب مدفوع بالفعل ✓" : "This order is already paid ✓" });
        } else if (data?.success) {
          writeCheckoutSession({ orderId: data.orderId, checkoutToken: data.checkoutToken });
          if (Array.isArray(data.items) && data.items.length > 0) {
            replaceCart(
              data.items.map((i: { productId: string; name: string; price: number; image: string | null; quantity: number }): CartItem => ({
                productId: i.productId,
                name: i.name,
                nameEn: i.name,
                price: i.price,
                image: i.image || FALLBACK_IMAGE,
                quantity: i.quantity,
              }))
            );
          }
          const c = data.customer ?? {};
          const country = countries.find((x) => x.code === c.country);
          const dial = country?.phoneCode ?? "";
          const phone: string = c.customerPhone ?? "";
          setFormData({
            customerName: c.customerName ?? "",
            customerPhone: dial && phone.startsWith(dial) ? phone.slice(dial.length) : phone,
            customerEmail: c.customerEmail ?? "",
            country: country?.code ?? "",
            countryCode: dial,
            city: c.city ?? "",
            address: c.address ?? "",
          });
        }
      } catch (err) {
        console.warn("Could not resume order:", err);
      } finally {
        setRestoring(false);
        setSearchParams({}, { replace: true });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Refresh cart prices from the DB (a cart saved days ago may be stale) ──
  useEffect(() => {
    if (resumeId || items.length === 0) return;
    supabase
      .from("products")
      .select("id, price, is_active")
      .in("id", items.map((i) => i.productId))
      .then(({ data }) => {
        if (!data) return;
        const next = items
          .filter((i) => data.some((p) => p.id === i.productId && p.is_active))
          .map((i) => ({ ...i, price: Number(data.find((p) => p.id === i.productId)!.price) }));
        const changed = next.length !== items.length || next.some((n, idx) => n.price !== items[idx].price);
        if (changed) replaceCart(next);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Auto-detect country via IP (never overrides a value already set) ──────
  useEffect(() => {
    const detect = async () => {
      try {
        const res = await fetch("https://ipwho.is/", { signal: AbortSignal.timeout(4000) });
        const data = await res.json();
        if (data?.success && data.country_code) {
          const matched = countries.find((c) => c.code === data.country_code);
          if (matched) {
            setFormData((prev) =>
              prev.country ? prev : { ...prev, country: matched.code, countryCode: matched.phoneCode }
            );
          }
        }
      } catch {
        // silent — user can pick manually
      } finally {
        setDetectingCountry(false);
      }
    };
    detect();
  }, []);

  // Google Ads Begin Checkout Conversion Event
  // NOTE: يحتاج Conversion ID منفصل للـ Begin Checkout - استبدل 'YYYYYY' بالـ ID من Google Ads
  useEffect(() => {
    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "conversion", {
        send_to: "AW-17646380077/YYYYYY", // ⚠️ Replace with your Begin Checkout Conversion ID
      });
    }
  }, []);

  // Meta Pixel InitiateCheckout
  useEffect(() => {
    if (items.length === 0) return;
    trackInitiateCheckout({
      contentIds: items.map((i) => i.productId),
      value: totalPrice,
      numItems: items.reduce((s, i) => s + i.quantity, 0),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Abandoned-cart capture ────────────────────────────────────────────────
  // As soon as the customer has typed a valid phone number the order is saved
  // to the admin panel; every later change updates the same order.
  const queueSave = (payload: Record<string, unknown>) => {
    saveChainRef.current = saveChainRef.current
      .then(async () => {
        const session = readCheckoutSession();
        const { data } = await supabase.functions.invoke("checkout-session", {
          body: { action: "save", ...payload, orderId: session?.orderId, checkoutToken: session?.checkoutToken },
        });
        if (data?.success && data.orderId) {
          writeCheckoutSession({ orderId: data.orderId, checkoutToken: data.checkoutToken });
        }
      })
      .catch((err) => console.warn("Checkout autosave failed:", err));
  };

  useEffect(() => {
    if (restoring || processing || items.length === 0) return;
    if (localPhoneDigits(formData.customerPhone) < 7) return;
    const phone = toInternationalPhone(formData.customerPhone, formData.countryCode);
    if (!phone) return;

    const payload = {
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: phone,
      country: formData.country,
      city: formData.city,
      address: formData.address,
      cartItems: cartItemsPayload,
    };
    const key = JSON.stringify(payload);
    if (key === lastSavedRef.current) return;

    const timer = setTimeout(() => {
      lastSavedRef.current = key;
      queueSave(payload);
    }, 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, cartItemsPayload, restoring, processing]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formError) setFormError(null);
  };

  const selectCountry = (country: { code: string; phoneCode: string }) => {
    setFormData((prev) => ({ ...prev, country: country.code, countryCode: country.phoneCode }));
    if (formError) setFormError(null);
    phoneInputRef.current?.focus();
  };

  // ── Card path validation ──────────────────────────────────────────────────
  const validateForm = () => {
    const fail = (message: string, ref?: React.RefObject<HTMLInputElement>) => {
      setFormError(message);
      ref?.current?.focus();
      ref?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    };
    if (items.length === 0) return fail(isAr ? "السلة فارغة، أضف منتجاً أولاً" : "Cart is empty, add a product first");
    if (!formData.customerName.trim()) return fail(t("order.validation.name"), nameInputRef);
    if (!formData.country) return fail(t("order.validation.country"));
    if (localPhoneDigits(formData.customerPhone) < 7) {
      return fail(isAr ? "يرجى إدخال رقم جوال صحيح" : "Please enter a valid phone number", phoneInputRef);
    }
    const email = formData.customerEmail.trim();
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return fail(isAr ? "صيغة البريد الإلكتروني غير صحيحة" : "Please enter a valid email", emailInputRef);
    }
    if (!formData.city.trim()) return fail(t("order.validation.city"), cityInputRef);
    if (!formData.address.trim()) return fail(t("order.validation.address"), addressInputRef);
    setFormError(null);
    return true;
  };

  // ── Called when the customer pays (card or wallet) ───────────────────────
  const preparePayment = async (express?: ExpressDetails): Promise<PreparedPayment> => {
    // Let any pending autosave finish so we reuse its order instead of creating another.
    await saveChainRef.current;

    const country = (express?.country || formData.country || "").toUpperCase();
    const details = {
      customerName: (express?.customerName || formData.customerName).trim(),
      customerEmail: (express?.customerEmail || formData.customerEmail).trim(),
      customerPhone:
        walletPhone(express?.customerPhone, country) ||
        toInternationalPhone(formData.customerPhone, formData.countryCode),
      country,
      city: (express?.city || formData.city).trim(),
      address: (express?.address || formData.address).trim(),
    };

    if (!details.customerName || !details.country || !details.city || !details.address || !details.customerPhone) {
      throw new Error(
        isAr
          ? "بيانات التوصيل غير مكتملة. أكمل الاسم والجوال والمدينة والعنوان."
          : "Delivery details are incomplete. Please add your name, phone, city and address."
      );
    }

    const session = readCheckoutSession();
    const { data, error } = await supabase.functions.invoke("create-payment-intent", {
      body: { ...details, cartItems: cartItemsPayload, orderId: session?.orderId, checkoutToken: session?.checkoutToken },
    });

    const generic = isAr ? "تعذّر تجهيز الدفع، حاول مرة أخرى" : ERROR_MESSAGES_EN.server_error;
    if (error) throw new Error((isAr && (await readFunctionError(error))) || generic);
    if (!data?.success || !data.clientSecret) {
      const code: string | undefined = data?.code;
      throw new Error(isAr ? data?.error || generic : (code && ERROR_MESSAGES_EN[code]) || generic);
    }

    writeCheckoutSession({ orderId: data.order_id, checkoutToken: data.checkout_token });

    // Server prices are authoritative: if they differ, update the cart so the
    // customer sees the real total before paying.
    if (data.amountMinor !== amountMinor && Array.isArray(data.items)) {
      replaceCart(
        items.map((i) => {
          const server = data.items.find((s: { productId: string; unitPrice: number }) => s.productId === i.productId);
          return server ? { ...i, price: Number(server.unitPrice) } : i;
        })
      );
    }

    return { clientSecret: data.clientSecret, orderId: data.order_id, amountMinor: data.amountMinor };
  };

  const title = isAr ? "اطلب سفن جرين الآن - توصيل سريع" : "Order Seven Green Now - Fast Delivery";
  const description = isAr
    ? "اطلب صابونة سفن جرين المثلثة الأصلية الآن. ضمان استرجاع المال 30 يوم. دفع آمن 100%."
    : "Order the original Seven Green Triangle Soap now. 30-day money-back guarantee. 100% secure payment.";

  const offerSchema = {
    "@context": "https://schema.org",
    "@type": "Offer",
    url: "https://sevensgreen.com/order",
    priceCurrency: "SAR",
    price: totalPrice.toString(),
    availability: "https://schema.org/InStock",
    itemOffered: {
      "@type": "Product",
      name: isAr ? "صابونة سفن جرين المثلثة" : "Seven Green Triangle Soap",
    },
    seller: { "@type": "Organization", name: "Seven Green" },
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "SAR" },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" },
        transitTime: { "@type": "QuantitativeValue", minValue: 2, maxValue: 5, unitCode: "DAY" },
      },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: isAr ? "الرئيسية" : "Home", item: "https://sevensgreen.com/" },
      { "@type": "ListItem", position: 2, name: isAr ? "اطلب الآن" : "Order Now", item: "https://sevensgreen.com/order" },
    ],
  };

  const align = isAr ? "text-right" : "text-left";

  // Prices show in the customer's currency, but the charge is always in SAR:
  // the real amount stays visible on the button and in the note under the total.
  const isForeignCurrency = selectedCurrency !== "SAR";
  const approxTotal = isForeignCurrency ? ` (≈ ${formatPrice(totalPrice)})` : "";
  const payLabel = isAr
    ? `ادفع ${formatSar(totalPrice)} ريال${approxTotal}`
    : `Pay SAR ${formatSar(totalPrice)}${approxTotal}`;
  const chargeNote = isForeignCurrency && (
    <p className={`text-xs text-[#5B6656] leading-relaxed ${align}`}>
      {isAr
        ? `الخصم الفعلي ${formatSar(totalPrice)} ريال سعودي (SAR)، وقد يختلف المبلغ قليلاً حسب بنكك.`
        : `You will be charged SAR ${formatSar(totalPrice)}. The final amount may vary slightly depending on your bank.`}
    </p>
  );

  const detailsComplete =
    !!formData.customerName.trim() &&
    !!formData.country &&
    localPhoneDigits(formData.customerPhone) >= 7 &&
    !!formData.city.trim() &&
    !!formData.address.trim();

  const paymentFormProps = {
    amountMinor,
    payLabel,
    detailsComplete,
    billingDetails: {
      name: formData.customerName,
      email: formData.customerEmail,
      phone: toInternationalPhone(formData.customerPhone, formData.countryCode),
    },
    billingCountry: formData.country,
    formError,
    validate: validateForm,
    prepare: preparePayment,
    returnUrl: (orderId: string) => `${window.location.origin}${langPath("/payment-success")}?order_id=${orderId}`,
    onProcessingChange: setProcessing,
  };

  // First visit, theme not known yet (normally cached by the landing page): brief loader
  // instead of flashing one layout and then the other.
  if (!storeTheme.ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F8F4]">
        <Loader2 className="w-7 h-7 animate-spin text-primary" />
      </div>
    );
  }

  // ── "Simple" checkout theme (chosen in Admin → المظهر) ──────────────────
  if (storeTheme.checkout === "simple") {
    const selectedCountry = countries.find((c) => c.code === formData.country);
    const quickCities = QUICK_CITIES[formData.country] ?? [];
    const fieldClass =
      "h-[52px] rounded-xl border-[1.5px] border-[#D3DCCD] bg-white px-3.5 text-base focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0 focus-visible:border-primary";
    const labelClass = `block text-sm font-semibold text-gray-900 ${align}`;
    const cityValue = formData.city.trim();

    return (
      <div className="min-h-screen bg-[#F6F8F4] text-[#1F2A1B]" dir={isAr ? "rtl" : "ltr"}>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <link rel="canonical" href="https://sevensgreen.com/order" />
        </Helmet>

        {/* Minimal header: nothing to distract from paying */}
        <header className="sticky top-0 z-30 h-14 bg-white border-b border-[#E3EADF]">
          <div className="max-w-xl mx-auto h-full px-4 flex items-center justify-between">
            <Link to={langPath("/")} className="font-extrabold text-lg tracking-wide text-primary">
              SEVEN GREEN
            </Link>
            <span className="flex items-center gap-1.5 text-[13px] font-semibold text-[#3A5233]">
              <Lock className="w-4 h-4" />
              {isAr ? "دفع آمن ومشفّر" : "Secure checkout"}
            </span>
          </div>
        </header>

        <main className="max-w-xl mx-auto px-4 py-4 space-y-3.5">
          <h1 className="sr-only">{t("order.title")}</h1>

          {restoring ? (
            <section className="bg-white border border-[#E3EADF] rounded-2xl p-8 text-center">
              <Loader2 className="w-6 h-6 mx-auto mb-3 animate-spin text-primary" />
              <p className="text-[#5B6656]">{isAr ? "جاري استرجاع طلبك..." : "Restoring your order..."}</p>
            </section>
          ) : items.length === 0 ? (
            <section className="bg-white border border-[#E3EADF] rounded-2xl p-8 text-center">
              <p className="text-[#5B6656] mb-4">{isAr ? "سلتك فارغة" : "Your cart is empty"}</p>
              <Link to={langPath("/products")}>
                <Button className="h-12 rounded-xl px-6 font-bold">{isAr ? "تصفح المنتجات" : "Browse products"}</Button>
              </Link>
            </section>
          ) : (
            <>
              {/* Order summary */}
              <section className="bg-white border border-[#E3EADF] rounded-2xl p-3.5 space-y-3">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={isAr ? item.name : item.nameEn}
                      className="w-16 h-16 shrink-0 rounded-xl object-cover bg-[#E9F0E6]"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-bold leading-snug line-clamp-2">{isAr ? item.name : item.nameEn}</p>
                      <p className="text-[13px] text-[#5B6656] flex items-center gap-1">
                        <PriceDisplay {...getPriceData(item.price)} /> {isAr ? "للقطعة" : "each"}
                      </p>
                    </div>
                    <div className="flex items-center rounded-full border border-[#DDE5D8] bg-white shrink-0">
                      <button
                        type="button"
                        disabled={processing}
                        onClick={() => updateQty(item.productId, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center disabled:opacity-40"
                        aria-label={isAr ? "زيادة الكمية" : "Increase quantity"}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <span className="min-w-[22px] text-center font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        disabled={processing}
                        onClick={() => updateQty(item.productId, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center disabled:opacity-40"
                        aria-label={
                          item.quantity === 1 ? (isAr ? "حذف" : "Remove") : isAr ? "إنقاص الكمية" : "Decrease quantity"
                        }
                      >
                        {item.quantity === 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
                <div className="border-t border-dashed border-[#DDE5D8] pt-2.5 space-y-1.5">
                  <div className="flex justify-between text-sm text-[#5B6656]">
                    <span>{isAr ? "الشحن" : "Shipping"}</span>
                    <span className="font-bold text-[#2F6B2A]">{isAr ? "مجاني" : "Free"}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-base font-bold">{t("order.total")}</span>
                    <span className="flex items-baseline gap-1 text-[26px] font-extrabold text-primary">
                      {isForeignCurrency && <span aria-label={isAr ? "تقريباً" : "approximately"}>≈</span>}
                      <PriceDisplay {...getPriceData(totalPrice)} />
                    </span>
                  </div>
                  {chargeNote}
                </div>
              </section>

              <StripePaymentForm {...paymentFormProps} variant="simple">
                <fieldset disabled={processing} className="space-y-3.5">
                  {/* Hidden field so browser autofill profiles can populate the country */}
                  <input
                    type="text"
                    name="country"
                    autoComplete="country"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="sr-only"
                    onChange={(e) => {
                      const val = e.target.value.trim().toLowerCase();
                      if (!val) return;
                      const match = countries.find((c) => c.code.toLowerCase() === val || c.nameEn.toLowerCase() === val);
                      if (match) selectCountry(match);
                    }}
                  />

                  {/* Country: one line, auto-detected */}
                  {selectedCountry && !showCountryPicker ? (
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="text-[#5B6656]">
                        {isAr ? "التوصيل إلى: " : "Delivering to: "}
                        <b className="text-gray-900">
                          {selectedCountry.flag} {isAr ? selectedCountry.nameAr : selectedCountry.nameEn}
                        </b>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowCountryPicker(true)}
                        className="min-h-[44px] px-1 font-bold text-[#3A5233]"
                      >
                        {isAr ? "تغيير" : "Change"}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <Label className={labelClass}>
                        {t("order.country")}
                        {detectingCountry && (
                          <Loader2 className="inline w-3 h-3 mx-1 animate-spin text-[#5B6656]" />
                        )}
                      </Label>
                      <CountrySelect
                        value={formData.country}
                        onChange={(c) => {
                          selectCountry(c);
                          setShowCountryPicker(false);
                        }}
                        placeholder={
                          detectingCountry
                            ? isAr ? "جاري اكتشاف دولتك..." : "Detecting your country..."
                            : t("order.country.placeholder")
                        }
                      />
                    </div>
                  )}

                  {/* Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className={labelClass}>{isAr ? "الاسم" : "Name"}</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      enterKeyHint="next"
                      ref={nameInputRef}
                      onKeyDown={focusNext(phoneInputRef)}
                      placeholder={isAr ? "مثال: سارة أحمد" : "e.g. Sarah Ahmed"}
                      value={formData.customerName}
                      onChange={(e) => handleInputChange("customerName", e.target.value)}
                      className={`${fieldClass} ${align}`}
                    />
                  </div>

                  {/* Phone: one field with the country code inside */}
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className={labelClass}>{isAr ? "رقم الجوال" : "Phone number"}</Label>
                    <div
                      dir="ltr"
                      className="flex h-[52px] rounded-xl border-[1.5px] border-[#D3DCCD] bg-white overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
                    >
                      <button
                        type="button"
                        onClick={() => setShowCountryPicker(true)}
                        className="px-3 bg-[#F1F5EE] border-r border-[#D3DCCD] text-[15px] font-bold shrink-0"
                        aria-label={isAr ? "تغيير مفتاح الدولة" : "Change country code"}
                      >
                        {formData.countryCode || "+"}
                      </button>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel-national"
                        enterKeyHint="next"
                        ref={phoneInputRef}
                        onKeyDown={focusNext(cityInputRef)}
                        placeholder={t("order.phone.placeholder")}
                        value={formData.customerPhone}
                        onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                        className="flex-1 min-w-0 px-3 text-[17px] tracking-wide bg-transparent outline-none placeholder:text-[#7A8574]"
                      />
                    </div>
                    <p className={`text-xs text-[#5B6656] ${align}`}>
                      {isAr ? "للتواصل معك بخصوص التوصيل فقط" : "Only used to contact you about delivery"}
                    </p>
                  </div>

                  {/* City: quick buttons + free text */}
                  <div className="space-y-2">
                    <Label htmlFor="city" className={labelClass}>{t("order.city")}</Label>
                    {quickCities.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {quickCities.map(([ar, en]) => {
                          const label = isAr ? ar : en;
                          const selected = cityValue === ar || cityValue === en;
                          return (
                            <button
                              key={en}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => {
                                handleInputChange("city", label);
                                addressInputRef.current?.focus();
                              }}
                              className={`min-h-[44px] px-4 rounded-full border-[1.5px] text-sm font-bold transition-colors ${
                                selected
                                  ? "border-primary bg-[#E9F0E6] text-[#2A3D25]"
                                  : "border-[#D3DCCD] bg-white text-gray-900"
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      autoComplete="address-level2"
                      enterKeyHint="next"
                      ref={cityInputRef}
                      onKeyDown={focusNext(addressInputRef)}
                      placeholder={
                        quickCities.length > 0 ? (isAr ? "أو اكتب مدينتك" : "or type your city") : t("order.city.placeholder")
                      }
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className={`${fieldClass} ${align}`}
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-1.5">
                    <Label htmlFor="address" className={labelClass}>{isAr ? "العنوان" : "Address"}</Label>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      autoComplete="street-address"
                      enterKeyHint="done"
                      ref={addressInputRef}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.currentTarget.blur();
                        }
                      }}
                      placeholder={isAr ? "الحي، الشارع، رقم المنزل" : "District, street, building no."}
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className={`${fieldClass} ${align}`}
                    />
                  </div>

                  {/* Email: optional, collapsed */}
                  {showEmail || formData.customerEmail ? (
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className={labelClass}>
                        {isAr ? "البريد الإلكتروني " : "Email "}
                        <span className="font-normal text-[#5B6656]">{isAr ? "(اختياري)" : "(optional)"}</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        dir="ltr"
                        ref={emailInputRef}
                        placeholder="example@email.com"
                        value={formData.customerEmail}
                        onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                        className={`${fieldClass} ${align}`}
                      />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setShowEmail(true);
                        setTimeout(() => emailInputRef.current?.focus(), 0);
                      }}
                      className="min-h-[44px] text-sm font-bold text-[#3A5233]"
                    >
                      {isAr ? "+ أضف بريدك لاستلام رقم التتبع (اختياري)" : "+ Add your email to get the tracking number (optional)"}
                    </button>
                  )}
                </fieldset>
              </StripePaymentForm>
            </>
          )}
        </main>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sevensgreen.com/order" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <link rel="canonical" href="https://sevensgreen.com/order" />
        <link rel="alternate" hrefLang="ar" href="https://sevensgreen.com/order?lang=ar" />
        <link rel="alternate" hrefLang="en" href="https://sevensgreen.com/order?lang=en" />
        <script type="application/ld+json">{JSON.stringify(offerSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <MobileOptimized className="min-h-screen bg-gradient-to-br from-green-50 to-white" dir={isAr ? "rtl" : "ltr"}>
        <Header />
        <MobileNav />

        {/* Breadcrumb */}
        <nav className="container mx-auto px-4 py-2" aria-label="breadcrumb">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link to={langPath("/")} className="text-muted-foreground hover:text-foreground transition-colors">
                {isAr ? "الرئيسية" : "Home"}
              </Link>
            </li>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <li>
              <span className="text-foreground font-medium">{isAr ? "إتمام الطلب" : "Checkout"}</span>
            </li>
          </ol>
        </nav>

        <div className="mobile-container py-2 sm:py-4">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="text-center px-4">
              <h1 className="mobile-heading font-bold text-gray-900 mb-1">
                {t("order.title")}
                <span className="block text-base font-medium text-primary mt-1">SEVEN GREEN</span>
              </h1>
            </div>

            {restoring ? (
              <Card className="p-8 text-center">
                <Loader2 className="w-6 h-6 mx-auto mb-3 animate-spin text-primary" />
                <p className="text-muted-foreground">{isAr ? "جاري استرجاع طلبك..." : "Restoring your order..."}</p>
              </Card>
            ) : items.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">{isAr ? "سلتك فارغة" : "Your cart is empty"}</p>
                <Link to={langPath("/products")}>
                  <Button variant="outline" className="rounded-full">
                    {isAr ? "تصفح المنتجات" : "Browse Products"}
                  </Button>
                </Link>
              </Card>
            ) : (
              <>
                {/* ── Order summary ─────────────────────────────────────── */}
                <Card className="mobile-card shadow-medium border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className={`mobile-subheading ${align}`}>{isAr ? "ملخص الطلب" : "Order summary"}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 pt-0 space-y-3">
                    <div className="space-y-1.5">
                      {items.map((item) => (
                        <div key={item.productId} className="flex items-center gap-2 p-1.5 bg-accent/10 rounded-lg">
                          <img
                            src={item.image}
                            alt={isAr ? item.name : item.nameEn}
                            className="w-10 h-10 object-cover rounded-lg shrink-0"
                            onError={(e) => {
                              e.currentTarget.src = FALLBACK_IMAGE;
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{isAr ? item.name : item.nameEn}</p>
                            <p className="text-primary text-sm font-bold">
                              <PriceDisplay {...getPriceData(item.price * item.quantity)} />
                            </p>
                          </div>
                          <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-white">
                            <button
                              type="button"
                              disabled={processing}
                              onClick={() => updateQty(item.productId, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 text-sm disabled:opacity-40"
                              aria-label={isAr ? "إنقاص الكمية" : "Decrease quantity"}
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                            <button
                              type="button"
                              disabled={processing}
                              onClick={() => updateQty(item.productId, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 text-sm disabled:opacity-40"
                              aria-label={isAr ? "زيادة الكمية" : "Increase quantity"}
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            disabled={processing}
                            onClick={() => removeItem(item.productId)}
                            className="text-red-400 hover:text-red-600 text-lg px-1 disabled:opacity-40"
                            aria-label={isAr ? "حذف" : "Remove"}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-3 space-y-1.5 text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>{isAr ? "الشحن" : "Shipping"}</span>
                        <span className="font-semibold text-green-600">{isAr ? "مجاني" : "Free"}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span className="text-gray-700">{t("order.total")}</span>
                        <span className="flex items-baseline gap-1 text-2xl md:text-3xl text-primary">
                          {isForeignCurrency && <span aria-label={isAr ? "تقريباً" : "approximately"}>≈</span>}
                          <PriceDisplay {...getPriceData(totalPrice)} />
                        </span>
                      </div>
                      {chargeNote}
                    </div>
                  </CardContent>
                </Card>

                {/* ── Details → payment method (wallet or card) ─────────────── */}
                <Card className="mobile-card shadow-medium border-border/50">
                  <CardContent className="p-3 sm:p-4">
                    <StripePaymentForm {...paymentFormProps}>
                      <fieldset disabled={processing} className="space-y-3">
                        <p className={`text-sm font-semibold text-gray-800 ${align}`}>
                          {isAr ? "بيانات التوصيل" : "Delivery details"}
                        </p>

                        {/* الاسم */}
                        <div className="space-y-1.5">
                          <Label htmlFor="name" className={`block mobile-text font-medium ${align}`}>
                            {t("order.name")} *
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            enterKeyHint="next"
                            ref={nameInputRef}
                            onKeyDown={focusNext(phoneInputRef)}
                            placeholder={t("order.name.placeholder")}
                            value={formData.customerName}
                            onChange={(e) => handleInputChange("customerName", e.target.value)}
                            className={`mobile-input ${align}`}
                          />
                        </div>

                        {/* الدولة */}
                        <div className="space-y-1.5">
                          <Label className={`block mobile-text font-medium flex items-center gap-2 ${align}`}>
                            <Flag className="w-4 h-4" />
                            {t("order.country")} *
                            {detectingCountry && !formData.country && (
                              <span className="text-xs text-muted-foreground font-normal flex items-center gap-1">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                {isAr ? "جاري الاكتشاف..." : "Detecting..."}
                              </span>
                            )}
                          </Label>
                          {/* Hidden field so browser autofill profiles can populate the country */}
                          <input
                            type="text"
                            name="country"
                            autoComplete="country"
                            tabIndex={-1}
                            aria-hidden="true"
                            className="sr-only"
                            onChange={(e) => {
                              const val = e.target.value.trim().toLowerCase();
                              if (!val) return;
                              const match = countries.find(
                                (c) => c.code.toLowerCase() === val || c.nameEn.toLowerCase() === val
                              );
                              if (match) selectCountry(match);
                            }}
                          />
                          <CountrySelect
                            value={formData.country}
                            onChange={selectCountry}
                            placeholder={
                              detectingCountry
                                ? isAr ? "جاري اكتشاف دولتك..." : "Detecting your country..."
                                : t("order.country.placeholder")
                            }
                          />
                        </div>

                        {/* رقم الجوال */}
                        <div className="space-y-1.5">
                          <Label htmlFor="phone" className={`block mobile-text font-medium flex items-center gap-2 ${align}`}>
                            <Phone className="w-4 h-4" />
                            {t("order.phone")} *
                          </Label>
                          <div className="flex gap-2">
                            <div className="w-[130px] shrink-0">
                              <CountrySelect value={formData.country} onChange={selectCountry} phoneCodeOnly />
                            </div>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              inputMode="tel"
                              autoComplete="tel-national"
                              enterKeyHint="next"
                              ref={phoneInputRef}
                              onKeyDown={focusNext(emailInputRef)}
                              placeholder={t("order.phone.placeholder")}
                              value={formData.customerPhone}
                              onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                              className={`mobile-input flex-1 ${align}`}
                            />
                          </div>
                        </div>

                        {/* البريد */}
                        <div className="space-y-1.5">
                          <Label htmlFor="email" className={`block mobile-text font-medium ${align}`}>
                            {t("order.email")}
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            enterKeyHint="next"
                            ref={emailInputRef}
                            onKeyDown={focusNext(cityInputRef)}
                            placeholder={t("order.email.placeholder")}
                            value={formData.customerEmail}
                            onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                            className={`mobile-input ${align}`}
                          />
                          <p className={`text-xs text-muted-foreground ${align}`}>
                            {isAr ? "لإرسال تأكيد الطلب ورقم التتبع" : "For your order confirmation and tracking number"}
                          </p>
                        </div>

                        {/* المدينة */}
                        <div className="space-y-1.5">
                          <Label htmlFor="city" className={`block mobile-text font-medium ${align}`}>
                            {t("order.city")} *
                          </Label>
                          <Input
                            id="city"
                            name="city"
                            type="text"
                            autoComplete="address-level2"
                            enterKeyHint="next"
                            ref={cityInputRef}
                            onKeyDown={focusNext(addressInputRef)}
                            placeholder={t("order.city.placeholder")}
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            className={`mobile-input ${align}`}
                          />
                        </div>

                        {/* العنوان */}
                        <div className="space-y-1.5">
                          <Label htmlFor="address" className={`block mobile-text font-medium ${align}`}>
                            {t("order.address")} *
                          </Label>
                          <Input
                            id="address"
                            name="address"
                            type="text"
                            autoComplete="street-address"
                            enterKeyHint="done"
                            ref={addressInputRef}
                            onKeyDown={(e) => {
                              // Enter must not trigger the payment.
                              if (e.key === "Enter") {
                                e.preventDefault();
                                e.currentTarget.blur();
                              }
                            }}
                            placeholder={t("order.address.placeholder")}
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            className={`mobile-input ${align}`}
                          />
                        </div>
                      </fieldset>
                    </StripePaymentForm>
                  </CardContent>
                </Card>

                <PaymentMethods />
              </>
            )}

            {/* Trust Signals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Card className="p-3 text-center">
                <Shield className="w-7 h-7 mx-auto mb-1.5 text-primary" />
                <h3 className="font-semibold text-sm">{isAr ? "دفع آمن 100%" : "100% Secure Payment"}</h3>
              </Card>
              <Card className="p-3 text-center">
                <Truck className="w-7 h-7 mx-auto mb-1.5 text-primary" />
                <h3 className="font-semibold text-sm">{isAr ? "توصيل سريع" : "Fast Delivery"}</h3>
              </Card>
              <Card className="p-3 text-center">
                <RotateCcw className="w-7 h-7 mx-auto mb-1.5 text-primary" />
                <h3 className="font-semibold text-sm">{isAr ? "ضمان 30 يوم" : "30-Day Guarantee"}</h3>
              </Card>
            </div>

            {/* SEO Content */}
            <section className="mt-8 prose prose-lg dark:prose-invert mx-auto max-w-3xl px-4">
              <h2 className="text-2xl font-bold mb-4">
                {isAr ? "لماذا تطلب من سفن جرين؟" : "Why Order from Seven Green?"}
              </h2>
              <ul className="space-y-2">
                <li>✅ {isAr ? "توصيل سريع" : "Fast delivery"}</li>
                <li>✅ {isAr ? "ضمان استرجاع المال 30 يوم" : "30-day money-back guarantee"}</li>
                <li>✅ {isAr ? "منتج أصلي 100% معتمد من هيئة الغذاء والدواء" : "100% original product certified by the Saudi FDA"}</li>
                <li>✅ {isAr ? "دعم عملاء على مدار الساعة" : "24/7 customer support"}</li>
                <li>✅ {isAr ? "دفع آمن ومشفر" : "Secure encrypted payment"}</li>
              </ul>
            </section>

            <TrustBadges />
          </div>
        </div>
      </MobileOptimized>
    </>
  );
};

export default Order;
