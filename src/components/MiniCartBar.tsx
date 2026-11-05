import LangLink from "@/components/LangLink";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/hooks/useLanguage";
import { useStoreTheme } from "@/hooks/useStoreTheme";
import { PriceDisplay } from "@/components/PriceDisplay";

/**
 * "Simple" product-card theme only: a bar fixed to the bottom of the
 * products page showing the cart total and a "Complete order" button.
 * Renders nothing (and takes no space) otherwise.
 */
const MiniCartBar = () => {
  const { productCard } = useStoreTheme();
  const { totalItems, totalPrice } = useCart();
  const { language } = useLanguage();
  const isAr = language === "ar";

  if (productCard !== "simple" || totalItems === 0) return null;

  return (
    <>
      <div className="h-24" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-40 bg-white border-t border-[#E3EADF] shadow-[0_-6px_20px_rgba(31,42,27,0.08)] px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="max-w-xl mx-auto flex items-center gap-3" dir={isAr ? "rtl" : "ltr"}>
          <div className="flex-1 flex flex-col">
            <span className="text-xs text-[#5B6656]">
              {isAr ? `في سلتك ${totalItems} منتج` : `${totalItems} item${totalItems > 1 ? "s" : ""} in cart`}
            </span>
            <span className="text-lg font-extrabold">
              <PriceDisplay amount={totalPrice} currency="SAR" />
            </span>
          </div>
          <LangLink
            to="/order"
            className="h-12 px-6 rounded-xl bg-primary text-white text-base font-extrabold flex items-center hover:bg-primary/90"
          >
            {isAr ? "إتمام الطلب" : "Checkout"}
          </LangLink>
        </div>
      </div>
    </>
  );
};

export default MiniCartBar;
