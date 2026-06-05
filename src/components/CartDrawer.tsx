import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/hooks/useLanguage";
import { useCurrency } from "@/hooks/useCurrency";
import { PriceDisplay } from "@/components/PriceDisplay";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const CartDrawer = () => {
  const { language } = useLanguage();
  const { getPriceData } = useCurrency();
  const { items, removeItem, updateQty, totalItems, totalPrice } = useCart();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      {/* Cart trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label={language === 'ar' ? 'السلة' : 'Cart'}
      >
        <ShoppingCart className="w-5 h-5 text-gray-600" />
        {totalItems > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center min-w-[18px] min-h-[18px] px-1">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`
          fixed top-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl
          flex flex-col duration-300 ${mounted ? 'transition-transform' : ''}
          ${language === 'ar' ? 'left-0' : 'right-0'}
          ${open
            ? 'translate-x-0'
            : language === 'ar' ? '-translate-x-full' : 'translate-x-full'
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-gray-900">
              {language === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}
            </h2>
            {totalItems > 0 && (
              <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <ShoppingCart className="w-16 h-16 opacity-20" />
              <p className="font-medium">
                {language === 'ar' ? 'السلة فارغة' : 'Your cart is empty'}
              </p>
              <Link to="/products" onClick={() => setOpen(false)}>
                <Button variant="outline" size="sm" className="rounded-full mt-2">
                  {language === 'ar' ? 'تصفح المنتجات' : 'Browse Products'}
                </Button>
              </Link>
            </div>
          ) : (
            items.map(item => (
              <div key={item.productId} className="flex gap-3 bg-gray-50 rounded-xl p-3">
                <img
                  src={item.image}
                  alt={language === 'ar' ? item.name : item.nameEn}
                  className="w-16 h-16 object-cover rounded-lg shrink-0 bg-white"
                  onError={(e) => { e.currentTarget.src = "/images/sevengreen-logo.webp"; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 line-clamp-2 leading-tight">
                    {language === 'ar' ? item.name : item.nameEn}
                  </p>
                  <p className="text-primary font-bold text-sm mt-1">
                    <PriceDisplay {...getPriceData(item.price)} />
                  </p>
                  <div className={`flex items-center gap-2 mt-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-white">
                      <button
                        onClick={() => updateQty(item.productId, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.productId, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">
                {language === 'ar' ? 'الإجمالي:' : 'Total:'}
              </span>
              <span className="text-xl font-black text-primary">
                <PriceDisplay {...getPriceData(totalPrice)} />
              </span>
            </div>
            <Link to="/order" onClick={() => setOpen(false)} className="block">
              <Button className="w-full rounded-full font-bold gap-2">
                <ShoppingCart className="w-4 h-4" />
                {language === 'ar' ? 'إتمام الطلب' : 'Checkout'}
              </Button>
            </Link>
            <Link to="/products" onClick={() => setOpen(false)} className="block text-center text-sm text-gray-500 hover:text-primary">
              {language === 'ar' ? '← متابعة التسوق' : '← Continue Shopping'}
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
