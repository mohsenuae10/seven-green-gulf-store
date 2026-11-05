// Remembers which abandoned-checkout order belongs to this browser, so every
// change on /order updates the SAME order row instead of creating a new one.
// The token is a per-order secret issued by the checkout-session function.

const KEY = "sg_checkout";

export interface CheckoutSession {
  orderId: string;
  checkoutToken: string;
}

export const readCheckoutSession = (): CheckoutSession | null => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.orderId && parsed?.checkoutToken ? parsed : null;
  } catch {
    return null;
  }
};

export const writeCheckoutSession = (session: CheckoutSession) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    // storage unavailable — autosave still works for this page view
  }
};

export const clearCheckoutSession = () => {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
};
