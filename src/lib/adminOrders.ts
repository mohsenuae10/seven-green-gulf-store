// Helpers for the admin panel's order lists.

type PageResult<T> = PromiseLike<{ data: T[] | null; error: unknown }>;

/**
 * Loads every row of a query, page by page.
 *
 * Supabase returns at most 1,000 rows per request, so a plain `.select()`
 * silently drops the rest. The store passed 1,000 orders in November 2026:
 * the panel stopped showing the oldest ones and its totals came up short.
 * `page(from, to)` must return the query with `.range(from, to)` and a stable
 * order (end with a unique column such as id).
 */
export async function fetchAllRows<T>(
  page: (from: number, to: number) => PageResult<T>,
  pageSize = 1000,
): Promise<{ data: T[]; error: unknown }> {
  const rows: T[] = [];
  // The 500-page cap only guards against a query that ignores the range.
  for (let i = 0; i < 500; i++) {
    const { data, error } = await page(rows.length, rows.length + pageSize - 1);
    if (error) return { data: rows, error };
    // Stop on an empty page, not a short one: the server may cap pages below pageSize.
    if (!data?.length) break;
    rows.push(...data);
  }
  return { data: rows, error: null };
}

interface DatedOrder {
  created_at: string;
  paid_at?: string | null;
}

/**
 * The date that matters for an order: when it was paid, or for an unpaid
 * order when it was opened. created_at is when the customer typed their
 * phone, and a customer can come back and pay the same order days later,
 * so a paid order sorted by created_at sank below newer unpaid ones.
 */
export const orderDate = (order: DatedOrder) => order.paid_at || order.created_at;

/** Newest first, by orderDate. */
export const byNewestOrderDate = (a: DatedOrder, b: DatedOrder) =>
  Date.parse(orderDate(b)) - Date.parse(orderDate(a));

/** The order was opened more than an hour before it was paid. */
export const paidLater = (order: DatedOrder) =>
  !!order.paid_at && Date.parse(order.paid_at) - Date.parse(order.created_at) > 60 * 60 * 1000;

export const formatOrderDate = (iso: string) => new Date(iso).toLocaleDateString("ar-AE");

export const formatOrderTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("ar-AE", { hour: "2-digit", minute: "2-digit", hour12: true });
