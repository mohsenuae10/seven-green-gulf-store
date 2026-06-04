import { useState } from "react";
import {
  Elements,
  PaymentElement,
  ExpressCheckoutElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import { getStripe } from "@/integrations/stripe/client";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Lock, CreditCard } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface StripePaymentFormProps {
  clientSecret: string;
  orderId: string;
  amount?: number;
  amountLabel?: string;
  onBack?: () => void;
}

interface CheckoutFormProps {
  orderId: string;
  amountLabel?: string;
  onBack?: () => void;
}

const stripePromise = getStripe();

const CheckoutForm = ({ orderId, amountLabel, onBack }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { language } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasExpressCheckout, setHasExpressCheckout] = useState(false);

  const returnUrl = `${window.location.origin}/payment-success?order_id=${orderId}`;

  // Called when Apple Pay / Google Pay button is available
  const handleExpressReady = ({ availablePaymentMethods }: { availablePaymentMethods: Record<string, boolean> | null }) => {
    if (availablePaymentMethods) setHasExpressCheckout(true);
  };

  // Called when user authorises via Apple Pay / Google Pay
  const handleExpressConfirm = async () => {
    if (!stripe || !elements) return;
    setIsProcessing(true);
    setError(null);

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
    });

    if (confirmError) {
      setError(confirmError.message || (language === "ar" ? "فشل الدفع" : "Payment failed"));
      setIsProcessing(false);
    }
  };

  // Called when user submits card form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
    });

    if (submitError) {
      setError(
        submitError.message ||
          (language === "ar" ? "تعذّر إتمام الدفع. حاول مرة أخرى." : "Payment could not be completed. Please try again.")
      );
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Apple Pay / Google Pay — always mount, hidden until available */}
      <div className={hasExpressCheckout ? "space-y-3" : ""}>
        <ExpressCheckoutElement
          onConfirm={handleExpressConfirm}
          onReady={handleExpressReady}
          options={{
            buttonType: { applePay: "buy", googlePay: "buy" },
            buttonHeight: 56,
            layout: { maxColumns: 1, maxRows: 2, overflow: "auto" },
          }}
        />

        {hasExpressCheckout && (
          <div className="relative flex items-center gap-3 py-1">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-sm text-muted-foreground px-3 bg-white">
              {language === "ar" ? "أو ادفع ببطاقتك" : "Or pay with card"}
            </span>
            <div className="flex-1 border-t border-gray-200" />
          </div>
        )}
      </div>

      {/* Card form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-gray-700">
              {language === "ar" ? "بيانات البطاقة" : "Card details"}
            </span>
          </div>
          <PaymentElement
            options={{
              layout: "accordion",
              wallets: { applePay: "never", googlePay: "never" },
              defaultValues: { billingDetails: { address: { country: "SA" } } },
            }}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className={language === "ar" ? "text-right" : "text-left"}>
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          variant="hero"
          size="lg"
          className="w-full mobile-button touch-target h-14 text-base"
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {language === "ar" ? "جاري معالجة الدفع..." : "Processing payment..."}
            </>
          ) : (
            <>
              <Lock className="mr-2 h-5 w-5" />
              {language === "ar"
                ? `ادفع الآن${amountLabel ? ` ${amountLabel}` : ""}`
                : `Pay now${amountLabel ? ` ${amountLabel}` : ""}`}
            </>
          )}
        </Button>

        {onBack && (
          <Button type="button" variant="ghost" size="lg" className="w-full" onClick={onBack} disabled={isProcessing}>
            {language === "ar" ? "رجوع وتعديل البيانات" : "Back to edit details"}
          </Button>
        )}

        <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" />
          {language === "ar" ? "دفع آمن ومشفّر عبر Stripe" : "Secure encrypted payment via Stripe"}
        </p>
      </form>
    </div>
  );
};

const StripePaymentForm = ({ clientSecret, orderId, amountLabel, onBack }: StripePaymentFormProps) => {
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: { colorPrimary: "#16a34a", borderRadius: "8px" },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm orderId={orderId} amountLabel={amountLabel} onBack={onBack} />
    </Elements>
  );
};

export default StripePaymentForm;
