import { loadStripe, type Stripe } from "@stripe/stripe-js";

const STRIPE_PUBLISHABLE_KEY =
  (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined) ||
  "pk_live_51S8iZq9IHXjyx3CsobK3TyLqWY5FUacNMlOmxJ3Le4BKPxfTI2pus3VWuYt4SIrDKz0h0Eye7aZCu0Fi0mPZvdpR001ekUgN3o";

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};
