import { useState } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import { getStripe } from "@/integrations/stripe/client";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Lock } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface StripePaymentFormProps {
  clientSecret: string;
  orderId: string;
  /** Optional: shown on the pay button, already formatted for display. */
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // The webhook is the source of truth; this page is display-only.
        return_url: `${window.location.origin}/payment-success?order_id=${orderId}`,
      },
    });

    // If we reach here, confirmation failed before redirect (e.g. card declined).
    if (submitError) {
      setError(
        submitError.message ||
          (language === "ar" ? "تعذّر إتمام الدفع. حاول مرة أخرى." : "Payment could not be completed. Please try again.")
      );
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement
        options={{
          layout: "accordion",
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
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#16a34a",
        borderRadius: "8px",
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
