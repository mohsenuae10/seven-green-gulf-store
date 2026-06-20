declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

const fbq = (...args: any[]) => {
  const fbqExists = typeof window !== "undefined" && typeof window.fbq === "function";
  console.log("[MetaPixel] fbq call:", args, "| window.fbq exists:", fbqExists);
  if (fbqExists) {
    window.fbq!(...args);
    console.log("[MetaPixel] fbq call dispatched to window.fbq");
  } else {
    console.warn("[MetaPixel] window.fbq is NOT available — event dropped:", args);
  }
};

export const trackPageView = () => fbq("track", "PageView");

export const trackViewContent = (params: {
  contentId: string;
  contentName: string;
  value: number;
  currency?: string;
}) =>
  fbq("track", "ViewContent", {
    content_ids: [params.contentId],
    content_name: params.contentName,
    content_type: "product",
    value: params.value,
    currency: params.currency || "SAR",
  });

export const trackAddToCart = (params: {
  contentId: string;
  contentName: string;
  value: number;
  quantity?: number;
  currency?: string;
}) =>
  fbq("track", "AddToCart", {
    content_ids: [params.contentId],
    content_name: params.contentName,
    content_type: "product",
    value: params.value,
    currency: params.currency || "SAR",
    contents: [{ id: params.contentId, quantity: params.quantity || 1 }],
  });

export const trackInitiateCheckout = (params: {
  contentIds: string[];
  value: number;
  numItems?: number;
  currency?: string;
}) =>
  fbq("track", "InitiateCheckout", {
    content_ids: params.contentIds,
    content_type: "product",
    value: params.value,
    currency: params.currency || "SAR",
    num_items: params.numItems,
  });

export const trackPurchase = (params: {
  value: number;
  currency: string;
  orderId?: string;
  contentIds?: string[];
}) =>
  fbq("track", "Purchase", {
    value: params.value,
    currency: params.currency,
    content_ids: params.contentIds,
    content_type: "product",
    ...(params.orderId ? { order_id: params.orderId } : {}),
  });
