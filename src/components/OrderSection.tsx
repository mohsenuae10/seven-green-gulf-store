import { useState } from "react";
import { useProductPrice } from "@/hooks/useProductPrice";
import { useCurrency } from "@/hooks/useCurrency";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, MapPin, Phone, User, CreditCard, Truck, Shield, Crown, Plus, Minus, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { PriceDisplay } from "@/components/PriceDisplay";

const OrderSection = () => {
  const { language, t } = useLanguage();
  const { getPriceData, selectedCurrency } = useCurrency();
  const [quantity, setQuantity] = useState(1);
  const [cardQuantity, setCardQuantity] = useState(1);
  const { price, stockQuantity } = useProductPrice();
  const shipping = 0; // Fast shipping
  const total = price * quantity + shipping;

  const handleCardIncrement = () => {
    if (cardQuantity < stockQuantity) {
      setCardQuantity(cardQuantity + 1);
    }
  };

  const handleCardDecrement = () => {
    if (cardQuantity > 1) {
      setCardQuantity(cardQuantity - 1);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-primary/5" dir={language === 'ar' ? 'rtl' : 'ltr'} id="order">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-6 py-2 mb-6">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium">{t('order.section.badge')}</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {t('order.section.title')}
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('order.section.desc')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          
          {/* Order Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card border-border/50 shadow-medium">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                  <User className="w-6 h-6 text-primary" />
                  {t('order.info')}
                </h3>

                <form className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-foreground font-medium">{t('order.name')} *</Label>
                      <Input 
                        id="name" 
                        placeholder={t('order.name.placeholder')}
                        className="bg-background/50 border-border/50 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-foreground font-medium">{t('order.phone')} *</Label>
                      <Input 
                        id="phone" 
                        placeholder={t('order.phone.placeholder')}
                        className="bg-background/50 border-border/50 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-medium">{t('order.email')}</Label>
                    <Input 
                      id="email" 
                      type="email"
                      placeholder={t('order.email.placeholder')}
                      className="bg-background/50 border-border/50 focus:border-primary"
                    />
                  </div>

                  {/* Shipping Information */}
                  <div className="border-t border-border/50 pt-6">
                    <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      {t('order.shipping')}
                    </h4>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="country" className="text-foreground font-medium">{t('order.country')} *</Label>
                        <Select>
                          <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary">
                            <SelectValue placeholder={t('order.country.placeholder')} />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-50">
                            <SelectItem value="sa">{language === 'ar' ? 'السعودية' : 'Saudi Arabia'}</SelectItem>
                            <SelectItem value="ye">{language === 'ar' ? 'اليمن' : 'Yemen'}</SelectItem>
                            <SelectItem value="ae">{language === 'ar' ? 'الإمارات' : 'UAE'}</SelectItem>
                            <SelectItem value="us">{language === 'ar' ? 'الولايات المتحدة' : 'United States'}</SelectItem>
                            <SelectItem value="kw">{language === 'ar' ? 'الكويت' : 'Kuwait'}</SelectItem>
                            <SelectItem value="qa">{language === 'ar' ? 'قطر' : 'Qatar'}</SelectItem>
                            <SelectItem value="bh">{language === 'ar' ? 'البحرين' : 'Bahrain'}</SelectItem>
                            <SelectItem value="om">{language === 'ar' ? 'عُمان' : 'Oman'}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-foreground font-medium">{t('order.city')} *</Label>
                        <Input 
                          id="city" 
                          placeholder={t('order.city.placeholder')}
                          className="bg-background/50 border-border/50 focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label htmlFor="address" className="text-foreground font-medium">{t('order.address')} *</Label>
                      <Textarea 
                        id="address" 
                        placeholder={t('order.address.placeholder')}
                        rows={3}
                        className="bg-background/50 border-border/50 focus:border-primary resize-none"
                      />
                    </div>
                  </div>

                  {/* Quantity Selection */}
                  <div className="border-t border-border/50 pt-6">
                    <Label className="text-foreground font-medium mb-4 block">{t('order.quantity')}</Label>
                    <div className="flex items-center gap-4">
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-full"
                      >
                        -
                      </Button>
                      <span className="text-xl font-semibold text-foreground min-w-[3rem] text-center">{quantity}</span>
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-full"
                      >
                        +
                      </Button>
                      <span className="text-muted-foreground">× <PriceDisplay {...getPriceData(price)} /></span>
                    </div>
                  </div>
                </form>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            
            {/* Product Card */}
            <Card className="bg-gradient-card border-border/50 shadow-medium overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <Crown className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{t('product.title')}</h3>
                    <p className="text-muted-foreground text-sm">{language === 'ar' ? 'للعناية المتقدمة بالشعر' : 'Advanced Hair Care'}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[1,2,3,4,5].map((star) => (
                        <div key={star} className="w-3 h-3 bg-secondary rounded-full"></div>
                      ))}
                      <span className="text-xs text-muted-foreground mr-2">4.9 (2,847)</span>
                    </div>
                  </div>
                </div>

                {/* Price Display */}
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-primary">
                    <PriceDisplay {...getPriceData(price)} />
                  </div>
                </div>

                {/* Quantity Selector + Buy Button */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2 bg-background/50 rounded-full border border-border/50 px-3 py-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCardDecrement}
                      className="h-8 w-8 rounded-full hover:bg-primary/10"
                      disabled={cardQuantity <= 1}
                    >
                      <Minus className="h-4 w-4 text-primary" />
                    </Button>
                    <span className="text-lg font-semibold text-foreground min-w-[2.5rem] text-center">
                      {cardQuantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCardIncrement}
                      className="h-8 w-8 rounded-full hover:bg-primary/10"
                      disabled={cardQuantity >= stockQuantity}
                    >
                      <Plus className="h-4 w-4 text-primary" />
                    </Button>
                  </div>
                  <Link to="/order" className="flex-1">
                    <Button 
                      size="lg" 
                      className="w-full bg-gradient-primary hover:scale-105 transition-all duration-300 shadow-elegant rounded-full"
                    >
                      <ShoppingCart className={`w-5 h-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                      {t('hero.buy.now')}
                    </Button>
                  </Link>
                </div>

                {/* Stock Availability */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-semibold text-green-600">
                    {language === 'ar' 
                      ? `${stockQuantity.toLocaleString('ar-SA')} قطعة متوفرة`
                      : `${stockQuantity.toLocaleString()} pieces available`
                    }
                  </span>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 border-t border-border/50 pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('order.price.breakdown')} ({quantity} {language === 'ar' ? 'قطعة' : 'piece'})</span>
                    <span className="font-medium"><PriceDisplay {...getPriceData(price * quantity)} /></span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{language === 'ar' ? 'الشحن' : 'Shipping'}</span>
                    <span className="font-medium text-secondary">{t('order.shipping.free')}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-border/50 pt-3">
                    <span>{t('order.total')}</span>
                    <span className="text-primary"><PriceDisplay {...getPriceData(total)} /></span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-border/50">
                  <div className="text-center">
                    <Shield className="w-6 h-6 text-primary mx-auto mb-1" />
                    <span className="text-xs text-muted-foreground">{t('order.trust.safe')}</span>
                  </div>
                  <div className="text-center">
                    <Truck className="w-6 h-6 text-primary mx-auto mb-1" />
                    <span className="text-xs text-muted-foreground">{t('order.trust.fast')}</span>
                  </div>
                  <div className="text-center">
                    <CreditCard className="w-6 h-6 text-primary mx-auto mb-1" />
                    <span className="text-xs text-muted-foreground">{t('order.trust.secure')}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Order Button */}
            <Link to="/order">
              <Button 
                size="lg" 
                className="w-full bg-gradient-secondary hover:scale-105 transition-all duration-300 shadow-glow text-lg py-6 rounded-2xl"
              >
                <ShoppingCart className="w-5 h-5 ml-2" />
                {t('hero.buy.now')}
              </Button>
            </Link>

            {/* Payment Methods */}
            <Card className="bg-gradient-card border-border/50 p-4">
              <h4 className="font-semibold text-foreground mb-3 text-center">{t('order.payment.methods')}</h4>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-background/30 rounded-lg p-2">
                  <CreditCard className="w-6 h-6 mx-auto mb-1 text-primary" />
                  <span className="text-xs text-muted-foreground">{t('order.payment.credit')}</span>
                </div>
                <div className="bg-background/30 rounded-lg p-2">
                  <div className="w-6 h-6 mx-auto mb-1 bg-secondary rounded"></div>
                  <span className="text-xs text-muted-foreground">{t('order.payment.cod')}</span>
                </div>
              </div>
            </Card>

            {/* Contact Support */}
            <Card className="bg-gradient-card border-border/50 p-4">
              <h4 className="font-semibold text-foreground mb-3 text-center">{language === 'ar' ? 'تواصل معنا' : 'Contact Us'}</h4>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open("https://wa.me/971508824227", "_blank")}
                className="w-full hover:scale-105 transition-all duration-300"
              >
                <Phone className="w-4 h-4 ml-2" />
                {language === 'ar' ? 'واتساب +971508824227' : 'WhatsApp +971508824227'}
              </Button>
            </Card>

            {/* Guarantee */}
            <div className="text-center bg-secondary/10 rounded-xl p-4">
              <Shield className="w-8 h-8 text-secondary mx-auto mb-2" />
              <div className="font-semibold text-secondary">{t('order.guarantee')}</div>
              <div className="text-sm text-muted-foreground">{t('order.guarantee.desc')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderSection;