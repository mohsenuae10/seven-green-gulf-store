import { Component, useMemo, useState, type ReactNode } from "react";
import { Elements, PaymentElement, ExpressCheckoutElement, useStripe, useElements } from "@stripe/react-stripe-js";
import type {
  StripeElementLocale,
  StripeElementsOptions,
  StripeExpressCheckoutElementClickEvent,
  StripeExpressCheckoutElementConfirmEvent,
  StripeExpressCheckoutElementOptions,
  StripeExpressCheckoutElementReadyEvent,
} from "@stripe/stripe-js";
import { getStripe } from "@/integrations/stripe/client";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CreditCard, Loader2, Lock } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

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
  /** Error from the parent's own form validation, shown next to the Pay button. */
  formError?: string | null;
  /** Card path: validates the customer-details form; return false to stop. */
  validate: () => boolean;
  /** Saves the order and returns a PaymentIntent for the current cart. */
  prepare: (express?: ExpressDetails) => Promise<PreparedPayment>;
  returnUrl: (orderId: string) => string;
  onProcessingChange?: (processing: boolean) => void;
  /** Customer-details fields, rendered between the wallet buttons and the card form. */
  children?: ReactNode;
}

const stripePromise = getStripe();

/**
 * If the wallet buttons fail to load (e.g. a Stripe configuration error),
 * hide them instead of crashing the whole checkout — card payment keeps working.
 */
class WalletBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error) {
    console.error("Express checkout failed to load:", error);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const expressDetailsFromEvent = (event: StripeExpressCheckoutElementConfirmEvent): ExpressDetails => {
  const ship = event.shippingAddress;
  const bill = event.billingDetails;
  const a = ship?.address ?? bill?.address;
  return {
    customerName: ship?.name || bill?.name,
    customerEmail: bill?.email,
    customerPhone: bill?.phone,
    country: a?.country,
    city: a?.city || a?.state,
    address: [a?.line1, a?.line2, a?.state, a?.postal_code].filter(Boolean).join("، "),
  };
};

const CheckoutForm = ({
  amountMinor,
  payLabel,
  billingDetails,
  formError,
  validate,
  prepare,
  returnUrl,
  onProcessingChange,
  children,
}: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasWallets, setHasWallets] = useState(false);

  const generic = isAr ? "تعذّر إتمام الدفع. حاول مرة أخرى." : "Payment could not be completed. Please try again.";

  const setProcessing = (value: boolean) => {
    setIsProcessing(value);
    onProcessingChange?.(value);
  };

  const pay = async (express?: ExpressDetails, event?: StripeExpressCheckoutElementConfirmEvent) => {
    if (!stripe || !elements) return;
    setProcessing(true);
    setError(null);

    const fail = (message: string) => {
      event?.paymentFailed({ reason: "fail" });
      setError(message);
      setProcessing(false);
    };

    const { error: submitError } = await elements.submit();
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
          ? "تم تحديث سعر أحد المنتجات. راجع الإجمالي الجديد ثم اضغط ادفع مرة أخرى."
          : "A product price was updated. Please review the new total and press Pay again."
      );
    }

    const billing = Object.fromEntries(
      Object.entries(billingDetails).filter(([, v]) => typeof v === "string" && v.trim() !== "")
    );

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
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
    if (isProcessing) return;
    if (!validate()) return;
    await pay();
  };

  const handleExpressClick = (event: StripeExpressCheckoutElementClickEvent) => {
    if (isProcessing) {
      event.reject();
      return;
    }
    setError(null);
    event.resolve();
  };

  const handleExpressReady = (event: StripeExpressCheckoutElementReadyEvent) => {
    const available = event.availablePaymentMethods;
    setHasWallets(!!available && Object.values(available).some(Boolean));
  };

  const expressOptions = useMemo<StripeExpressCheckoutElementOptions>(
    () => ({
      buttonHeight: 48,
      buttonType: { applePay: "buy", googlePay: "buy" },
      emailRequired: true,
      phoneNumberRequired: true,
      shippingAddressRequired: true,
      // No allowedShippingCountries: Stripe rejects some codes from the store's
      // country list (e.g. SY) and that crashes the element. The server
      // validates the shipping country instead.
      shippingRates: [{ id: "free-shipping", displayName: isAr ? "شحن مجاني" : "Free shipping", amount: 0 }],
    }),
    [isAr]
  );

  const shownError = formError || error;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* 1. Apple Pay / Google Pay first — one tap, no typing */}
      <div className={hasWallets ? "" : "hidden"}>
        <p className={`text-sm font-semibold text-gray-800 mb-2 ${isAr ? "text-right" : "text-left"}`}>
          {isAr ? "دفع سريع" : "Express checkout"}
        </p>
        <WalletBoundary>
          <ExpressCheckoutElement
            options={expressOptions}
            onReady={handleExpressReady}
            onClick={handleExpressClick}
            onConfirm={(event) => pay(expressDetailsFromEvent(event), event)}
          />
        </WalletBoundary>
      </div>

      {hasWallets && (
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          <span>{isAr ? "أو أكمل بياناتك وادفع بالبطاقة" : "or enter your details and pay by card"}</span>
          <div className="h-px flex-1 bg-border" />
        </div>
      )}

      {/* 2. Customer details (from the order page) */}
      {children}

      {/* 3. Card */}
      <div className="space-y-2">
        <p className={`text-sm font-semibold text-gray-800 flex items-center gap-2 ${isAr ? "text-right" : "text-left"}`}>
          <CreditCard className="w-4 h-4" />
          {isAr ? "بيانات البطاقة" : "Card details"}
        </p>
        <PaymentElement
          options={{
            layout: "tabs",
            // Wallets are already offered above; don't show them twice.
            wallets: { applePay: "never", googlePay: "never" },
          }}
        />
      </div>

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
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isAr ? "جاري معالجة الدفع..." : "Processing payment..."}
          </>
        ) : (
          <>
            <Lock className="mr-2 h-4 w-4" />
            {payLabel}
          </>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
        <Lock className="w-3 h-3" />
        {isAr
          ? "دفع آمن ومشفّر عبر Stripe • يتم الخصم بالريال السعودي"
          : "Secure encrypted payment via Stripe • Charged in Saudi Riyals (SAR)"}
      </p>
    </form>
  );
};

const StripePaymentForm = (props: StripePaymentFormProps) => {
  const { language } = useLanguage();

  // Deferred-intent mode: the card form shows immediately with the cart
  // amount; the PaymentIntent is created only when the customer pays.
  const options = useMemo<StripeElementsOptions>(
    () => ({
      mode: "payment",
      amount: props.amountMinor,
      currency: "sar",
      locale: (language === "ar" ? "ar" : "en") as StripeElementLocale,
      appearance: {
        theme: "stripe",
        variables: {
          colorPrimary: "#16a34a",
          borderRadius: "8px",
          spacingUnit: "3px",
          fontSizeBase: "14px",
        },
        rules: {
          ".Input": { padding: "10px 12px" },
          ".Tab": { padding: "8px 12px" },
        },
      },
    }),
    [props.amountMinor, language]
  );

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm {...props} />
    </Elements>
  );
};

export default StripePaymentForm;
