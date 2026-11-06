import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Elements, PaymentElement, ExpressCheckoutElement, useStripe, useElements } from "@stripe/react-stripe-js";
import type {
  Stripe,
  StripeElementLocale,
  StripeElements,
  StripeElementsOptions,
  StripeExpressCheckoutElementClickEvent,
  StripeExpressCheckoutElementConfirmEvent,
  StripeExpressCheckoutElementOptions,
  StripeExpressCheckoutElementReadyEvent,
} from "@stripe/stripe-js";
import { getStripe } from "@/integrations/stripe/client";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CreditCard, Loader2, Lock, RotateCcw, Shield, Truck } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { countries } from "@/data/countries";
import visaLogo from "@/assets/payment-logos/visa.svg";
import mastercardLogo from "@/assets/payment-logos/mastercard.svg";
import applePayLogo from "@/assets/payment-logos/apple-pay.svg";
import googlePayLogo from "@/assets/payment-logos/google-pay.svg";

/** Customer details returned by Apple Pay / Google Pay. */
export interface ExpressDetails {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  country?: string;
  city?: string;
  address?: string;
}

export interface PreparedPayment {
  clientSecret: string;
  orderId: string;
  amountMinor: number;
}

interface StripePaymentFormProps {
  /** Current cart total in halalas (SAR × 100). The PaymentIntent is created only when the customer pays. */
  amountMinor: number;
  payLabel: string;
  billingDetails: { name?: string; email?: string; phone?: string };
  /** Country from the delivery details, so the card form doesn't ask for it again. */
  billingCountry?: string;
  /** Error from the parent's own form validation, shown next to the Pay button. */
  formError?: string | null;
  /** Card path: validates the customer-details form; return false to stop. */
  validate: () => boolean;
  /** Saves the order and returns a PaymentIntent for the current cart. */
  prepare: (express?: ExpressDetails) => Promise<PreparedPayment>;
  returnUrl: (orderId: string) => string;
  onProcessingChange?: (processing: boolean) => void;
  /** Customer-details fields, rendered above the payment options. */
  children?: ReactNode;
  /** "simple" = the admin-selectable mobile-first checkout theme. */
  variant?: "classic" | "simple";
  /**
   * All required delivery fields are filled. Apple Pay / Google Pay then use
   * them instead of asking for an address, and the simple theme's button moves on to the card.
   */
  detailsComplete?: boolean;
}

type PaymentMethod = "wallet" | "card";

/** One row of the payment-method list: its body opens when the row is selected. */
const PaymentOption = ({
  title,
  logos,
  selected,
  disabled,
  onSelect,
  children,
}: {
  title: string;
  logos: string[];
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
  children: ReactNode;
}) => (
  <div className={`rounded-xl border-[1.5px] bg-white transition-colors ${selected ? "border-primary ring-1 ring-primary" : "border-[#D3DCCD]"}`}>
    <label className="flex items-center gap-3 min-h-[52px] px-3.5 py-2.5 cursor-pointer">
      <input
        type="radio"
        name="payment-method"
        checked={selected}
        disabled={disabled}
        onChange={onSelect}
        className="w-5 h-5 shrink-0 accent-primary"
      />
      <span className="flex-1 min-w-0 text-[15px] font-bold text-gray-900">{title}</span>
      <span dir="ltr" className="flex items-center gap-1.5 shrink-0">
        {logos.map((logo) => (
          <img key={logo} src={logo} alt="" className="h-6 w-auto" />
        ))}
      </span>
    </label>
    {/* Stays mounted while closed: Stripe's elements must not be display:none, and typed card details survive switching. */}
    <div className={selected ? "px-3.5 pb-3.5 space-y-2.5" : "invisible h-0 overflow-hidden"}>{children}</div>
  </div>
);

const SimpleSection = ({ number, title, children }: { number: string; title: string; children: ReactNode }) => (
  <section className="bg-white border border-[#E3EADF] rounded-2xl p-4 space-y-3">
    <h2 className="flex items-center gap-2 text-[15px] font-bold text-gray-900">
      <span className="w-6 h-6 shrink-0 rounded-full bg-primary text-white text-[13px] inline-flex items-center justify-center">
        {number}
      </span>
      {title}
    </h2>
    {children}
  </section>
);

const stripePromise = getStripe();

// Apple Pay / Google Pay may only ship to the store's countries. Stripe refuses
// these three codes as shipping destinations, and passing one crashes the element.
const WALLET_UNSUPPORTED_COUNTRIES = new Set(["SY", "IR", "CU"]);
const WALLET_SHIPPING_COUNTRIES = countries.map((c) => c.code).filter((c) => !WALLET_UNSUPPORTED_COUNTRIES.has(c));

/**
 * If the wallet buttons fail to load (e.g. a Stripe configuration error),
 * hide them instead of crashing the whole checkout — card payment keeps working.
 */
class WalletBoundary extends Component<{ children: ReactNode; onFail: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error) {
    console.error("Express checkout failed to load:", error);
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

// Banks in these countries check the postal code against the card, so it stays
// in the card form. Everywhere else it is left out to keep the form short.
const POSTAL_CODE_COUNTRIES = new Set(["US", "GB", "CA"]);

const expressDetailsFromEvent = (
  event: StripeExpressCheckoutElementConfirmEvent,
  formHasEmail: boolean
): ExpressDetails => {
  const ship = event.shippingAddress;
  const bill = event.billingDetails;
  const a = ship?.address;
  // No address from the wallet means it wasn't asked for one: the details typed
  // in the form stand. The card's billing address is not a delivery address.
  if (!a?.country) return formHasEmail ? {} : { customerEmail: bill?.email };
  return {
    customerName: ship?.name || bill?.name,
    customerEmail: bill?.email,
    customerPhone: bill?.phone,
    country: a.country,
    city: a.city || a.state,
    address: [a.line1, a.line2, a.state, a.postal_code].filter(Boolean).join("، "),
  };
};

/**
 * Apple Pay / Google Pay run inside their OWN Elements instance (see the nested
 * <Elements> below), so the card form can never affect them: a wallet payment
 * works with every field on the page left empty, the wallet then supplies them.
 */
const WalletButtons = ({
  options,
  onReady,
  onClick,
  onPay,
}: {
  options: StripeExpressCheckoutElementOptions;
  onReady: (event: StripeExpressCheckoutElementReadyEvent) => void;
  onClick: (event: StripeExpressCheckoutElementClickEvent) => void;
  onPay: (stripe: Stripe, elements: StripeElements, event: StripeExpressCheckoutElementConfirmEvent) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  return (
    <ExpressCheckoutElement
      options={options}
      onReady={onReady}
      onClick={onClick}
      onConfirm={(event) => {
        if (stripe && elements) onPay(stripe, elements, event);
        else event.paymentFailed({ reason: "fail" });
      }}
    />
  );
};

const CheckoutForm = ({
  amountMinor,
  payLabel,
  billingDetails,
  billingCountry = "",
  formError,
  validate,
  prepare,
  returnUrl,
  onProcessingChange,
  children,
  variant = "classic",
  detailsComplete = false,
  elementsOptions,
}: StripePaymentFormProps & { elementsOptions: StripeElementsOptions }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [isProcessing, setIsProcessing] = useState(false);
  const [walletProcessing, setWalletProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [available, setAvailable] = useState<StripeExpressCheckoutElementReadyEvent["availablePaymentMethods"]>();
  const [walletsChecked, setWalletsChecked] = useState(false);
  const [choice, setChoice] = useState<PaymentMethod | null>(null);
  const [cardComplete, setCardComplete] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const hasWallets = !!available && Object.values(available).some(Boolean);
  // Apple Pay / Google Pay open by default where the device supports them.
  // Nothing opens until that's known, so the card form doesn't jump shut.
  const method: PaymentMethod | null = hasWallets ? (choice ?? "wallet") : walletsChecked || choice ? "card" : null;
  const formHasEmail = EMAIL_PATTERN.test(billingDetails.email?.trim() ?? "");

  // If Stripe never reports back about wallets, don't leave the customer without a pay button.
  useEffect(() => {
    const timer = setTimeout(() => setWalletsChecked(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const generic = isAr ? "تعذّر إتمام الدفع. حاول مرة أخرى." : "Payment could not be completed. Please try again.";

  const setProcessing = (value: boolean) => {
    setIsProcessing(value);
    onProcessingChange?.(value);
  };

  const pay = async (
    stripeApi: Stripe,
    elementsApi: StripeElements,
    express?: ExpressDetails,
    event?: StripeExpressCheckoutElementConfirmEvent
  ) => {
    setProcessing(true);
    setWalletProcessing(!!express);
    setError(null);
    setWalletError(null);

    const fail = (message: string) => {
      event?.paymentFailed({ reason: "fail" });
      // Show the message where the customer is: next to the button they pressed.
      if (express) setWalletError(message);
      else setError(message);
      setWalletProcessing(false);
      setProcessing(false);
    };

    const { error: submitError } = await elementsApi.submit();
    if (submitError) return fail(submitError.message || generic);

    let prepared: PreparedPayment;
    try {
      prepared = await prepare(express);
    } catch (e) {
      return fail(e instanceof Error && e.message ? e.message : generic);
    }

    if (prepared.amountMinor !== amountMinor) {
      return fail(
        isAr
          ? "تم تحديث سعر أحد المنتجات. راجع الإجمالي الجديد ثم حاول مرة أخرى."
          : "A product price was updated. Please review the new total and try again."
      );
    }

    const billing = {
      ...Object.fromEntries(Object.entries(billingDetails).filter(([, v]) => typeof v === "string" && v.trim() !== "")),
      // Required: Stripe rejects the payment if a field hidden with "never" isn't passed here.
      address: { country: billingCountry },
    };

    const { error: confirmError } = await stripeApi.confirmPayment({
      elements: elementsApi,
      clientSecret: prepared.clientSecret,
      confirmParams: {
        return_url: returnUrl(prepared.orderId),
        ...(express ? {} : { payment_method_data: { billing_details: billing } }),
      },
    });

    // On success Stripe redirects to return_url, so we only get here on error.
    if (confirmError) fail(confirmError.message || generic);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // With a wallet selected the only way to pay is the wallet's own button.
    if (method !== "card" || isProcessing || !stripe || !elements) return;
    if (!validate()) return;
    if (variant === "simple" && !cardComplete) {
      // Not an error: just take the customer to the next thing to fill in.
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      elements.getElement("payment")?.focus();
      return;
    }
    await pay(stripe, elements);
  };

  const handleExpressClick = (event: StripeExpressCheckoutElementClickEvent) => {
    if (isProcessing) {
      event.reject();
      return;
    }
    setWalletError(null);
    event.resolve();
  };

  const handleExpressReady = (event: StripeExpressCheckoutElementReadyEvent) => {
    setAvailable(event.availablePaymentMethods);
    setWalletsChecked(true);
  };

  const chooseMethod = (next: PaymentMethod) => {
    setChoice(next);
    if (next === "card") {
      requestAnimationFrame(() => cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
    }
  };

  const expressOptions = useMemo<StripeExpressCheckoutElementOptions>(
    () => ({
      buttonHeight: 48,
      buttonType: { applePay: "buy", googlePay: "buy" },
      // The wallet only asks for what the form doesn't have yet, so the sheet
      // can't show an old saved address that differs from the one just typed.
      emailRequired: !(detailsComplete && formHasEmail),
      phoneNumberRequired: !detailsComplete,
      shippingAddressRequired: !detailsComplete,
      allowedShippingCountries: WALLET_SHIPPING_COUNTRIES,
      shippingRates: [{ id: "free-shipping", displayName: isAr ? "شحن مجاني" : "Free shipping", amount: 0 }],
    }),
    [isAr, detailsComplete, formHasEmail]
  );

  const shownError = formError || error;

  const walletMethods: { name: string; logo: string }[] = [];
  if (available?.applePay) walletMethods.push({ name: "Apple Pay", logo: applePayLogo });
  if (available?.googlePay) walletMethods.push({ name: "Google Pay", logo: googlePayLogo });
  const walletName = walletMethods.map((m) => m.name).join(" / ") || (isAr ? "الدفع السريع" : "Express checkout");

  const expressElement = (
    <Elements stripe={stripePromise} options={elementsOptions}>
      <WalletBoundary
        onFail={() => {
          setAvailable(undefined);
          setWalletsChecked(true);
        }}
      >
        <WalletButtons
          options={expressOptions}
          onReady={handleExpressReady}
          onClick={handleExpressClick}
          onPay={(stripeApi, elementsApi, event) =>
            pay(stripeApi, elementsApi, expressDetailsFromEvent(event, formHasEmail), event)
          }
        />
      </WalletBoundary>
    </Elements>
  );

  const walletNote = (
    <p className="text-xs text-center text-[#5B6656] leading-relaxed">
      {detailsComplete
        ? isAr
          ? "سيصل طلبك إلى العنوان الذي كتبته أعلاه."
          : "Your order will ship to the address you entered above."
        : isAr
          ? "لم تكمل بيانات التوصيل؟ لا بأس، ستختار عنوانك في نافذة الدفع."
          : "Haven't finished your delivery details? No problem, you'll choose your address in the payment window."}
    </p>
  );

  const walletErrorAlert = walletError && (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className={isAr ? "text-right" : "text-left"}>
        {walletError} {isAr ? "لم يتم خصم أي مبلغ." : "You have not been charged."}
      </AlertDescription>
    </Alert>
  );

  // After the Apple Pay sheet closes the page would otherwise look like an
  // empty form for a few seconds, as if the customer still had to fill it in.
  const walletOverlay = walletProcessing && (
    <div className="fixed inset-0 z-50 bg-white/95 flex flex-col items-center justify-center gap-3 px-6 text-center" role="status">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="text-lg font-bold text-gray-900">{isAr ? "جاري تأكيد الدفع..." : "Confirming your payment..."}</p>
      <p className="text-sm text-[#5B6656]">
        {isAr ? "لا تغلق الصفحة، ستنتقل لتأكيد طلبك خلال ثوانٍ." : "Please don't close this page. You'll see your order confirmation in a few seconds."}
      </p>
    </div>
  );

  const cardElement = (
    <div ref={cardRef}>
      <PaymentElement
        onChange={(event) => setCardComplete(event.complete)}
        // A wallet check finishing late must not close a form the customer is typing in.
        onFocus={() => setChoice("card")}
        options={{
          layout: "tabs",
          // Wallets have their own option in the list; don't show them twice.
          wallets: { applePay: "never", googlePay: "never" },
          fields: {
            billingDetails: {
              address: POSTAL_CODE_COUNTRIES.has(billingCountry) ? { country: "never" } : "if_required",
            },
          },
          // Tells the postal code field which country's format to expect.
          defaultValues: { billingDetails: { address: { country: billingCountry || undefined } } },
        }}
      />
    </div>
  );

  const paymentOptions = (
    <div role="radiogroup" aria-label={isAr ? "طريقة الدفع" : "Payment method"}>
      {/* Rendered before Stripe knows whether a wallet exists: display:none can stop it loading. */}
      <div className={hasWallets ? "mb-2.5" : "invisible h-0 overflow-hidden"}>
        <PaymentOption
          title={walletName}
          logos={walletMethods.map((m) => m.logo)}
          selected={method === "wallet"}
          disabled={isProcessing}
          onSelect={() => chooseMethod("wallet")}
        >
          {expressElement}
          {walletNote}
          {walletErrorAlert}
        </PaymentOption>
      </div>
      <PaymentOption
        title={isAr ? "فيزا / ماستركارد" : "Visa / Mastercard"}
        logos={[visaLogo, mastercardLogo]}
        selected={method === "card"}
        disabled={isProcessing}
        onSelect={() => chooseMethod("card")}
      >
        {cardElement}
      </PaymentOption>
    </div>
  );

  const processingContent = (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {isAr ? "جاري معالجة الدفع..." : "Processing payment..."}
    </>
  );

  // ── "Simple" theme: numbered sections + pay bar fixed to the bottom ─────
  if (variant === "simple") {
    const trust = [
      { icon: Shield, label: isAr ? "دفع مشفّر" : "Encrypted" },
      { icon: Truck, label: isAr ? "شحن مجاني" : "Free shipping" },
      { icon: RotateCcw, label: isAr ? "ضمان 30 يوم" : "30-day guarantee" },
    ];

    // A selected wallet has its own button, so the pay bar belongs to the card option only.
    const showPayBar = method === "card";
    const readyToPay = detailsComplete && cardComplete;
    const nextStepLabel = !detailsComplete
      ? isAr ? "أكمل بيانات التوصيل" : "Complete your delivery details"
      : isAr ? "أدخل بيانات البطاقة" : "Enter your card details";

    return (
      <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
        {walletOverlay}

        <SimpleSection number={isAr ? "١" : "1"} title={isAr ? "بيانات التوصيل" : "Delivery details"}>
          {children}
        </SimpleSection>

        <SimpleSection number={isAr ? "٢" : "2"} title={isAr ? "طريقة الدفع" : "Payment method"}>
          {paymentOptions}
        </SimpleSection>

        <div className="grid grid-cols-3 gap-2">
          {trust.map(({ icon: Icon, label }) => (
            <div key={label} className="bg-white border border-[#E3EADF] rounded-xl py-2.5 px-1 flex flex-col items-center gap-1 text-center">
              <Icon className="w-5 h-5 text-primary" />
              <span className="text-xs font-bold">{label}</span>
            </div>
          ))}
        </div>

        {showPayBar && (
          <>
            {/* Room for the fixed pay bar */}
            <div className="h-36" aria-hidden="true" />

            <div className="fixed inset-x-0 bottom-0 z-40 bg-white border-t border-[#E3EADF] shadow-[0_-6px_20px_rgba(31,42,27,0.08)] px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="max-w-xl mx-auto space-y-2">
                {shownError && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className={isAr ? "text-right" : "text-left"}>{shownError}</AlertDescription>
                  </Alert>
                )}
                <Button
                  type="submit"
                  size="lg"
                  className={`w-full h-14 rounded-xl text-lg font-extrabold ${
                    readyToPay || isProcessing
                      ? "bg-primary hover:bg-primary/90 text-white"
                      : "bg-[#E9F0E6] hover:bg-[#DDE8D8] text-[#2A3D25] border border-primary"
                  }`}
                  disabled={!stripe || isProcessing}
                >
                  {isProcessing ? (
                    processingContent
                  ) : readyToPay ? (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      {payLabel}
                    </>
                  ) : (
                    nextStepLabel
                  )}
                </Button>
                <p className="text-[11px] text-center text-[#5B6656]">
                  {isAr
                    ? "يتم الخصم بالريال السعودي · لن يُخصم أي مبلغ قبل ضغطك على «ادفع»"
                    : "Charged in Saudi Riyals (SAR) · nothing is charged until you press Pay"}
                </p>
              </div>
            </div>
          </>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {walletOverlay}

      {/* 1. Customer details (from the order page) */}
      {children}

      {/* 2. Payment method: the chosen option opens below its row */}
      <div className="space-y-2">
        <p className={`text-sm font-semibold text-gray-800 flex items-center gap-2 ${isAr ? "text-right" : "text-left"}`}>
          <CreditCard className="w-4 h-4" />
          {isAr ? "طريقة الدفع" : "Payment method"}
        </p>
        {paymentOptions}
      </div>

      {/* A selected wallet has its own button, so these belong to the card option only. */}
      {method === "card" && (
        <>
          {shownError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className={isAr ? "text-right" : "text-left"}>{shownError}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full mobile-button touch-target"
            disabled={!stripe || isProcessing}
          >
            {isProcessing ? (
              processingContent
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                {payLabel}
              </>
            )}
          </Button>
        </>
      )}

      <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
        <Lock className="w-3 h-3" />
        {isAr
          ? "دفع آمن ومشفّر عبر Stripe • يتم الخصم بالريال السعودي"
          : "Secure encrypted payment via Stripe • Charged in Saudi Riyals (SAR)"}
      </p>
    </form>
  );
};

// Constant on purpose: Stripe does not allow changing `fonts` after mount.
const STRIPE_FONTS = [{ cssSrc: "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" }];

const StripePaymentForm = (props: StripePaymentFormProps) => {
  const { language } = useLanguage();
  const isSimple = props.variant === "simple";

  // Deferred-intent mode: the card form shows immediately with the cart
  // amount; the PaymentIntent is created only when the customer pays.
  const options = useMemo<StripeElementsOptions>(
    () => ({
      mode: "payment",
      amount: props.amountMinor,
      currency: "sar",
      locale: (language === "ar" ? "ar" : "en") as StripeElementLocale,
      fonts: STRIPE_FONTS,
      appearance: isSimple
        ? {
            // Match the simple theme's own fields: taller inputs, 16px text
            // (no iOS zoom), brand olive green.
            theme: "stripe",
            variables: {
              colorPrimary: "#53763F",
              colorText: "#1F2A1B",
              borderRadius: "12px",
              spacingUnit: "3px",
              fontSizeBase: "16px",
              fontFamily: "Cairo, sans-serif",
            },
            rules: {
              ".Input": { padding: "14px", border: "1.5px solid #D3DCCD", boxShadow: "none" },
              ".Input:focus": { border: "1.5px solid #53763F", boxShadow: "0 0 0 3px rgba(83,118,63,0.18)" },
              ".Label": { fontWeight: "600", fontSize: "14px" },
              ".Tab": { padding: "10px 12px" },
            },
          }
        : {
            theme: "stripe",
            variables: {
              colorPrimary: "#16a34a",
              borderRadius: "8px",
              spacingUnit: "3px",
              fontSizeBase: "14px",
              fontFamily: "Cairo, sans-serif",
            },
            rules: {
              ".Input": { padding: "10px 12px" },
              ".Tab": { padding: "8px 12px" },
            },
          },
    }),
    [props.amountMinor, language, isSimple]
  );

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm {...props} elementsOptions={options} />
    </Elements>
  );
};

export default StripePaymentForm;
