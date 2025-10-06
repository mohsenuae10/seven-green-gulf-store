import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UseProductPriceOptions {
  fallback?: number;
}

export function useProductPrice(options: UseProductPriceOptions = {}) {
  const { fallback } = options;
  const [price, setPrice] = useState<number | null>(fallback || null);
  const [stockQuantity, setStockQuantity] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLatestPrice = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('price, stock_quantity, updated_at')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        // Log but keep fallback
        console.error('Error fetching product price:', error);
        setError(error.message);
        return;
      }

      if (data?.price != null) {
        setPrice(Number(data.price));
        setStockQuantity(Number(data.stock_quantity ?? 0));
      }
    } catch (e: any) {
      console.error('Unexpected error fetching price:', e);
      setError(e?.message ?? 'unexpected_error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestPrice();

    // Realtime subscription to reflect admin updates instantly
    const channel = supabase
      .channel('products-price')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          // If the change could affect the active product price, refetch
          const newRow: any = payload.new || {};
          const oldRow: any = payload.old || {};
          if (newRow.is_active === true || oldRow.is_active === true) {
            fetchLatestPrice();
          }
        }
      )
      .subscribe();

    // Also refresh when tab becomes visible again
    const onVisibility = () => {
      if (!document.hidden) fetchLatestPrice();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      supabase.removeChannel(channel);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return { price: price || 0, stockQuantity: stockQuantity || 0, loading, error, refresh: fetchLatestPrice };
}
