import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Store theme chosen by the admin (Admin → المظهر), stored in
 * site_content under section "store_theme". Each area can use the
 * "classic" (original) or the "simple" (clearer, mobile-first) design.
 */
export type ThemeVariant = "classic" | "simple";

export interface StoreTheme {
  checkout: ThemeVariant;
  productCard: ThemeVariant;
}

export const DEFAULT_STORE_THEME: StoreTheme = { checkout: "classic", productCard: "classic" };
export const STORE_THEME_SECTION = "store_theme";
export const STORE_THEME_QUERY_KEY = ["store-theme"] as const;
const CACHE_KEY = "sg_store_theme";

export const normalizeStoreTheme = (raw: unknown): StoreTheme => {
  const r = (raw ?? {}) as Partial<Record<keyof StoreTheme, unknown>>;
  return {
    checkout: r.checkout === "simple" ? "simple" : "classic",
    productCard: r.productCard === "simple" ? "simple" : "classic",
  };
};

/** Remember the last theme so returning visitors never see the layout jump. */
export const cacheStoreTheme = (theme: StoreTheme) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(theme));
  } catch {
    // storage unavailable
  }
};

const readCachedTheme = (): StoreTheme | undefined => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? normalizeStoreTheme(JSON.parse(raw)) : undefined;
  } catch {
    return undefined;
  }
};

export const fetchStoreTheme = async (): Promise<StoreTheme> => {
  const { data, error } = await supabase
    .from("site_content")
    .select("content")
    .eq("section", STORE_THEME_SECTION)
    .maybeSingle();
  if (error) throw error;
  const theme = normalizeStoreTheme(data?.content);
  cacheStoreTheme(theme);
  return theme;
};

/**
 * Admin preview: opening a page with ?preview_checkout=simple&preview_card=simple
 * shows that design in THIS TAB only (kept in sessionStorage while browsing),
 * so a theme can be checked before saving. Customers are not affected.
 */
const PREVIEW_KEY = "sg_store_theme_preview";

const readPreview = (): Partial<StoreTheme> => {
  try {
    const query = new URLSearchParams(window.location.search);
    const checkout = query.get("preview_checkout");
    const productCard = query.get("preview_card");
    if (checkout || productCard) {
      sessionStorage.setItem(PREVIEW_KEY, JSON.stringify({ checkout, productCard }));
    }
    const raw = sessionStorage.getItem(PREVIEW_KEY);
    if (!raw) return {};
    const saved = JSON.parse(raw) as Record<string, unknown>;
    const preview: Partial<StoreTheme> = {};
    if (saved.checkout === "simple" || saved.checkout === "classic") preview.checkout = saved.checkout;
    if (saved.productCard === "simple" || saved.productCard === "classic") preview.productCard = saved.productCard;
    return preview;
  } catch {
    return {};
  }
};

export function useStoreTheme(): StoreTheme & { ready: boolean } {
  const { data, isError } = useQuery({
    queryKey: STORE_THEME_QUERY_KEY,
    queryFn: fetchStoreTheme,
    initialData: readCachedTheme,
    // The cached copy is only a placeholder: always re-check on page load.
    initialDataUpdatedAt: 0,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
  const [preview] = useState(readPreview);
  return { ...(data ?? DEFAULT_STORE_THEME), ...preview, ready: data !== undefined || isError };
}
