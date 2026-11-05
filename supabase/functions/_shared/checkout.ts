// Shared checkout helpers used by checkout-session and create-payment-intent.
// deno-lint-ignore-file no-explicit-any

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

/** An error whose message is safe to show to the customer. */
export class CheckoutError extends Error {
  code: string;
  constructor(message: string, code = "checkout_error") {
    super(message);
    this.code = code;
  }
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (v: unknown): v is string => typeof v === "string" && UUID_RE.test(v);

export interface CartItemInput {
  productId: string;
  quantity: number;
}

export interface CustomerInput {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  country?: string;
  city?: string;
  address?: string;
}

export interface ResolvedItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  name: string;
  imageUrl: string | null;
}

/** "+966 50-123 4567" -> "+966501234567". Returns "" when there are no digits. */
export const normalizePhone = (raw?: string): string => {
  const digits = (raw ?? "").replace(/\D/g, "");
  return digits ? `+${digits}` : "";
};

export const phoneDigitCount = (phone: string) => phone.replace(/\D/g, "").length;

/** Looks every cart line up in the DB so prices always come from the server. */
export async function resolveCart(supabase: any, cartItems: unknown): Promise<ResolvedItem[]> {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new CheckoutError("السلة فارغة", "empty_cart");
  }
  if (cartItems.length > 20) throw new CheckoutError("عدد المنتجات كبير جداً", "too_many_items");

  const qtyById = new Map<string, number>();
  for (const item of cartItems as CartItemInput[]) {
    const qty = Number(item?.quantity);
    if (!isUuid(item?.productId) || !Number.isInteger(qty) || qty < 1 || qty > 100) {
      throw new CheckoutError("كمية غير صحيحة", "invalid_quantity");
    }
    qtyById.set(item.productId, (qtyById.get(item.productId) ?? 0) + qty);
  }

  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, price, image_url")
    .in("id", [...qtyById.keys()])
    .eq("is_active", true);
  if (error) throw error;

  const resolved: ResolvedItem[] = [];
  for (const [productId, quantity] of qtyById) {
    const p = (products ?? []).find((row: any) => row.id === productId);
    if (!p) throw new CheckoutError("بعض المنتجات لم تعد متوفرة", "product_unavailable");
    resolved.push({
      productId,
      quantity,
      unitPrice: Number(p.price),
      name: p.name,
      imageUrl: p.image_url ?? null,
    });
  }
  return resolved;
}

export const cartTotal = (items: ResolvedItem[]) =>
  Math.round(items.reduce((s, i) => s + i.unitPrice * i.quantity, 0) * 100) / 100;

export interface UpsertResult {
  id: string;
  checkoutToken: string;
  paymentIntentId: string | null;
  total: number;
}

/**
 * Creates the order on first call and updates the SAME order afterwards
 * (matched by id + secret checkout token). A paid order is never touched —
 * a returning customer gets a fresh order instead.
 */
export async function upsertCheckoutOrder(
  supabase: any,
  params: {
    orderId?: unknown;
    checkoutToken?: unknown;
    customer: CustomerInput;
    items: ResolvedItem[];
    stage: "details" | "payment";
  },
): Promise<UpsertResult> {
  const { customer, items, stage } = params;
  const total = cartTotal(items);

  const fields = {
    customer_name: (customer.customerName ?? "").trim().slice(0, 200),
    customer_email: (customer.customerEmail ?? "").trim().slice(0, 200),
    customer_phone: normalizePhone(customer.customerPhone),
    country: (customer.country ?? "").trim().toUpperCase().slice(0, 2),
    city: (customer.city ?? "").trim().slice(0, 200),
    address: (customer.address ?? "").trim().slice(0, 500),
    total_amount: total,
    currency: "SAR",
    updated_at: new Date().toISOString(),
  };

  let existing: any = null;
  if (isUuid(params.orderId) && isUuid(params.checkoutToken)) {
    const { data } = await supabase
      .from("orders")
      .select("id, checkout_token, payment_status, checkout_stage, payment_intent_id")
      .eq("id", params.orderId)
      .eq("checkout_token", params.checkoutToken)
      .maybeSingle();
    if (data && data.payment_status !== "paid") existing = data;
  }

  // The stage only moves forward: once the customer pressed Pay it stays "payment".
  const nextStage = stage === "payment" || existing?.checkout_stage === "payment" ? "payment" : "details";

  let order: any;
  if (existing) {
    const { data, error } = await supabase
      .from("orders")
      .update({ ...fields, checkout_stage: nextStage })
      .eq("id", existing.id)
      .select("id, checkout_token, payment_intent_id")
      .single();
    if (error || !data) throw new Error(`order update failed: ${error?.message}`);
    order = data;
  } else {
    const { data, error } = await supabase
      .from("orders")
      .insert({ ...fields, status: "pending", payment_status: "pending", checkout_stage: nextStage })
      .select("id, checkout_token, payment_intent_id")
      .single();
    if (error || !data) throw new Error(`order insert failed: ${error?.message}`);
    order = data;
  }

  // Replace the order lines with the current cart.
  await supabase.from("order_items").delete().eq("order_id", order.id);
  const { error: itemsError } = await supabase.from("order_items").insert(
    items.map((i) => ({
      order_id: order.id,
      product_id: i.productId,
      product_name: i.name,
      product_image_url: i.imageUrl,
      quantity: i.quantity,
      unit_price: i.unitPrice,
      total_price: Math.round(i.unitPrice * i.quantity * 100) / 100,
    })),
  );
  if (itemsError) console.error("order_items insert failed:", itemsError);

  return {
    id: order.id,
    checkoutToken: order.checkout_token,
    paymentIntentId: order.payment_intent_id ?? null,
    total,
  };
}
