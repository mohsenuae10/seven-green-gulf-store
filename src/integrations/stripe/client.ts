import { loadStripe, type Stripe } from "@stripe/stripe-js";

// Stripe publishable key (safe to expose on the client).
// Set VITE_STRIPE_PUBLISHABLE_KEY in your environment (.env / hosting dashboard).
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = (): Promise<Stripe | null> => {
  if (!STRIPE_PUBLISHABLE_KEY) {
    console.error(
      "VITE_STRIPE_PUBLISHABLE_KEY is not set. Add it to your environment to enable payments."
    );
    return Promise.resolve(null);
  }
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};
