import { useState, useEffect } from "react";
import { Elements, PaymentElement, ExpressCheckoutElement, useStripe, useElements } from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import { getStripe } from "@/integrations/stripe/client";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Lock } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import type { StripeElementLocale } from "@stripe/stripe-js";

interface StripePaymentFormProps {
  clientSecret: string;
  orderId: string;
  amountLabel?: string;
  onBack?: () => void;
}

const stripePromise = getStripe();

const CheckoutForm = ({ orderId, amountLabel, onBack }: Omit<StripePaymentFormProps, "clientSecret">) => {
  const stripe = useStripe();
  const elements = useElements();
  const { language } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const confirmPayment = async () => {
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success?order_id=${orderId}`,
      },
    });

    if (submitError) {
      setError(
        submitError.message ||
          (language === "ar" ? "تعذّر إتمام الدفع. حاول مرة أخرى." : "Payment could not be completed. Please try again.")
      );
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await confirmPayment();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <ExpressCheckoutElement
        onConfirm={confirmPayment}
        options={{ buttonHeight: 55 }}
      />
      <PaymentElement
        options={{
          layout: "tabs",
          defaultValues: { billingDetails: { address: { country: "SA" } } },
        }}
      />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className={language === "ar" ? "text-right" : "text-left"}>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-3">
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
              {language === "ar" ? "جاري معالجة الدفع..." : "Processing payment..."}
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              {language === "ar"
                ? `ادفع الآن${amountLabel ? ` ${amountLabel}` : ""}`
                : `Pay now${amountLabel ? ` ${amountLabel}` : ""}`}
            </>
          )}
        </Button>

        {onBack && (
          <Button type="button" variant="ghost" size="lg" onClick={onBack} disabled={isProcessing}>
            {language === "ar" ? "رجوع وتعديل البيانات" : "Back to edit details"}
          </Button>
        )}
      </div>

      <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
        <Lock className="w-3 h-3" />
        {language === "ar" ? "دفع آمن ومشفّر عبر Stripe" : "Secure encrypted payment via Stripe"}
      </p>
    </form>
  );
};

const StripePaymentForm = ({ clientSecret, orderId, amountLabel, onBack }: StripePaymentFormProps) => {
  const { language } = useLanguage();

  const options: StripeElementsOptions = {
    clientSecret,
    locale: (language === 'ar' ? 'ar' : 'en') as StripeElementLocale,
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
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm orderId={orderId} amountLabel={amountLabel} onBack={onBack} />
    </Elements>
  );
};

export default StripePaymentForm;
