import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, ShoppingCart, Leaf, Crown, Shield, Play, CheckCircle, Triangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useProductPrice } from "@/hooks/useProductPrice";
import { useCurrency } from "@/hooks/useCurrency";
import { useLanguage } from "@/hooks/useLanguage";
import CurrencySwitcher from "@/components/CurrencySwitcher";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useCallback, useEffect, useState, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import OptimizedImage from "@/components/OptimizedImage";
import sevenGreenLogo from "@/assets/seven-green-logo.png";

const ProductHero = () => {
  const ORIGINAL_PRICE = 115; // السعر الأصلي
  const { price: productPrice, loading: priceLoading } = useProductPrice();
  const { formatPrice, selectedCurrency } = useCurrency();
  const { language, t } = useLanguage();
  console.log('[ProductHero] currency:', selectedCurrency, 'price:', formatPrice(productPrice));
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [productImages, setProductImages] = useState<{ src: string; alt: string }[]>([]);

  const [heroTitle, setHeroTitle] = useState<string>('Seven Green');
  const [heroSubtitle, setHeroSubtitle] = useState<string>('SEVEN GREEN');
  const [heroDescription, setHeroDescription] = useState<string>('Advanced natural formula from cypress leaves and rosemary plant, designed to prevent hair loss and control oils');
  const [heroFeatures, setHeroFeatures] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: site } = await supabase
          .from('site_content')
          .select('title, description, content')
          .eq('section', 'hero')
          .maybeSingle();
        if (site) {
          if (site.title) setHeroTitle(site.title);
          const c: any = site.content || {};
          if (c.subtitle) setHeroSubtitle(c.subtitle);
          if (c.description) setHeroDescription(c.description);
          if (Array.isArray(c.features)) setHeroFeatures(c.features);
        }
      } catch {}

      try {
        const { data: prod } = await supabase
          .from('products')
          .select('id')
          .eq('is_active', true)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        const productId = prod?.id;
        if (productId) {
          const { data: imgs } = await supabase
            .from('product_images')
            .select('image_url, alt_text, display_order')
            .eq('product_id', productId)
            .order('display_order');
          console.log('[ProductHero] Fetched images:', imgs?.length || 0);
          if (imgs && imgs.length) {
            setProductImages(imgs.map(i => ({ src: i.image_url, alt: i.alt_text || 'Product Image' })));
          }
        }
      } catch {}
    };

    load();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (productImages.length <= 1) return;
    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % productImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [productImages.length]);
  
  
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Beautiful Premium Header */}
      <header className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/30 via-black/10 to-transparent backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="mobile-container">
          <div className="flex items-center justify-between py-2 sm:py-2.5 px-3 sm:px-4 lg:px-6">
            {/* Logo Section - Text Only */}
            <div className="flex flex-col justify-center gap-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-wider font-english leading-none">
                <span className="bg-gradient-to-r from-white via-white to-secondary bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]">
                  SEVEN GREEN
                </span>
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-secondary font-bold drop-shadow-[0_2px_8px_rgba(139,195,74,0.5)]">سفن جرين</p>
            </div>

            {/* Language and Currency Switchers - Elegant */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/5 backdrop-blur-sm rounded-full px-2 py-1.5 border border-white/10">
              <LanguageSwitcher />
              <div className="w-px h-4 sm:h-5 bg-white/20"></div>
              <CurrencySwitcher variant="header" />
            </div>
          </div>
        </div>
      </header>

      {/* Admin Link - Hidden on mobile, shown on desktop */}
      {/* Removed as it's now in the header */}

      {/* Background with elegant neutral gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 opacity-10">
        <Leaf className="w-32 h-32 text-primary animate-pulse" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-10">
        <Crown className="w-24 h-24 text-secondary animate-pulse" />
      </div>

      <div className="mobile-container relative z-10 pt-20 sm:pt-24 lg:pt-16">
        
        {/* Main Hero Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-4rem)] sm:min-h-screen py-8 sm:py-12 lg:py-20">
          
          {/* Product Content - Right side for RTL */}
          <div className={`order-2 lg:order-1 space-y-6 lg:space-y-8 animate-slide-up text-center px-4 sm:px-0 ${language === 'ar' ? 'lg:text-right' : 'lg:text-left'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            
            {/* Brand Badge */}
            <div className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm rounded-full px-6 py-2 border border-secondary/30">
              <Crown className="w-5 h-5 text-secondary" />
              <span className="text-secondary-foreground font-medium">{t('hero.badge')}</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-3 lg:space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-7xl font-bold text-foreground leading-tight">
                <span className="block text-primary font-semibold">صابونة</span>
                <span className="bg-gradient-primary bg-clip-text text-transparent">{heroTitle}</span>
                <span className="block text-primary font-semibold">المثلثة</span>
                <span className="block text-lg sm:text-xl lg:text-2xl xl:text-3xl text-primary font-semibold mt-1 font-english">
                  {heroSubtitle}
                </span>
                <span className="block text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-secondary font-light mt-2">
                  {t('hero.subtitle')}
                </span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl leading-relaxed mx-auto lg:mx-0">
                {t('hero.description')}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
              {(heroFeatures.length ? heroFeatures.map((t, i) => ({ icon: [Leaf, Shield, Crown][i % 3], title: t })) : [
                { icon: Leaf, title: t('hero.feature.natural'), desc: t('hero.feature.natural.desc') },
                { icon: Shield, title: t('hero.feature.safe'), desc: t('hero.feature.safe.desc') },
                { icon: Crown, title: t('hero.feature.luxury'), desc: t('hero.feature.luxury.desc') }
              ]).map((feature, index) => (
                <Card key={index} className="bg-white border-primary/20 shadow-soft p-3 lg:p-4 text-center animate-bounce-in hover:shadow-medium transition-all" style={{animationDelay: `${index * 0.2}s`}}>
                  <feature.icon className="w-6 h-6 lg:w-8 lg:h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-foreground text-sm lg:text-base">{feature.title}</h3>
                  {feature.desc && <p className="text-xs lg:text-sm text-muted-foreground">{feature.desc}</p>}
                </Card>
              ))}
            </div>

            {/* Rating */}
            <div className={`flex items-center gap-2 ${language === 'ar' ? 'justify-center lg:justify-end' : 'justify-center lg:justify-start'}`}>
              <div className="flex gap-1">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-secondary text-secondary" />
                ))}
              </div>
              <span className="text-foreground font-medium">4.9</span>
              <span className="text-muted-foreground">(2,847 {t('hero.reviews')})</span>
            </div>

            {/* Success Stories */}
            <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-primary/20 shadow-soft">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                <span className="text-foreground font-semibold text-sm lg:text-base">{t('hero.success.title')}</span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 text-center">
                <div>
                  <div className="text-xl lg:text-2xl font-bold text-primary">97%</div>
                  <div className="text-xs lg:text-sm text-muted-foreground">{t('hero.stat.density')}</div>
                </div>
                <div>
                  <div className="text-xl lg:text-2xl font-bold text-primary">85%</div>
                  <div className="text-xs lg:text-sm text-muted-foreground">{t('hero.stat.reduction')}</div>
                </div>
                <div>
                  <div className="text-xl lg:text-2xl font-bold text-primary">92%</div>
                  <div className="text-xs lg:text-sm text-muted-foreground">{t('hero.stat.shine')}</div>
                </div>
                <div>
                  <div className="text-xl lg:text-2xl font-bold text-primary">4 {t('hero.stat.weeks')}</div>
                  <div className="text-xs lg:text-sm text-muted-foreground">{t('hero.stat.weeks.desc')}</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className={`flex flex-col items-center gap-4 ${language === 'ar' ? 'lg:items-end' : 'lg:items-start'}`}>
              <Link to="/order">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-secondary hover:scale-105 transition-all duration-300 shadow-glow text-base lg:text-lg px-8 lg:px-12 py-4 lg:py-6 rounded-full"
                >
                  <ShoppingCart className={`w-5 h-5 lg:w-6 lg:h-6 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                  {t('hero.buy.now')} - {priceLoading ? <Skeleton className="inline w-16 h-4" /> : (
                    <span className="flex items-center gap-2">
                      <span className="text-white/70 line-through text-sm">{formatPrice(115)}</span>
                      <span className="text-white font-bold">{formatPrice(productPrice)}</span>
                    </span>
                  )}
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className={`flex flex-wrap items-center gap-4 lg:gap-6 text-muted-foreground text-xs lg:text-sm ${language === 'ar' ? 'justify-center lg:justify-end' : 'justify-center lg:justify-start'}`}>
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3 lg:w-4 lg:h-4 text-primary" />
                <span>{t('hero.guarantee')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Crown className="w-3 h-3 lg:w-4 lg:h-4 text-secondary" />
                <span>{t('hero.exclusive')}</span>
              </div>
            </div>
          </div>

          {/* Product Carousel - Left side for RTL */}
          <div className="order-1 lg:order-2 relative animate-fade-in">
            <div className="relative">
              {/* Glowing effect behind carousel */}
              <div className="absolute inset-0 bg-gradient-secondary opacity-30 blur-3xl rounded-full transform rotate-12"></div>
              
              {/* Product Images Carousel */}
              <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
                {/* Main Image Display */}
                <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-strong">
                  {productImages.length > 0 ? (
                    <div className="aspect-square w-full overflow-hidden rounded-2xl lg:rounded-3xl bg-white/5 backdrop-blur-sm flex items-center justify-center">
                      <OptimizedImage
                        key={selectedIndex}
                        src={productImages[selectedIndex].src}
                        alt={productImages[selectedIndex].alt}
                        className="w-full h-full object-cover"
                        priority={true}
                        fill={true}
                      />
                    </div>
                   ) : (
                    <div className="aspect-square w-full bg-muted rounded-2xl lg:rounded-3xl flex items-center justify-center border border-border">
                      <span className="text-muted-foreground">لا توجد صور</span>
                    </div>
                  )}
                  
                  {/* Navigation Arrows */}
                  {productImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setSelectedIndex((prev) => (prev - 1 + productImages.length) % productImages.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 z-20"
                        aria-label="Previous"
                      >
                        <span className="text-2xl font-bold">‹</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedIndex((prev) => (prev + 1) % productImages.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 z-20"
                        aria-label="Next"
                      >
                        <span className="text-2xl font-bold">›</span>
                      </button>
                    </>
                  )}
                </div>
                
                {/* Carousel Dots */}
                {productImages.length > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    {productImages.map((_, index) => (
                      <button
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === selectedIndex 
                            ? 'bg-secondary w-8 shadow-glow' 
                            : 'bg-white/40 hover:bg-white/60'
                        }`}
                        onClick={() => setSelectedIndex(index)}
                        aria-label={`Image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
                
                {/* Thumbnails */}
                {productImages.length > 1 && (
                  <div className="mt-4 flex justify-center gap-2 overflow-x-auto px-2">
                    {productImages.map((thumb, i) => (
                      <button
                        key={`thumb-${i}`}
                        onClick={() => setSelectedIndex(i)}
                        className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                          i === selectedIndex 
                            ? 'border-secondary shadow-glow scale-110' 
                            : 'border-white/30 hover:border-white/60 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <OptimizedImage
                          src={thumb.src}
                          alt={thumb.alt}
                          className="w-full h-full object-cover"
                          priority={false}
                        />
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Swipe indicator for mobile */}
                <div className="flex items-center justify-center gap-2 mt-3 text-muted-foreground text-xs sm:hidden">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-primary/40 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                    <div className="w-1 h-1 bg-primary/40 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-1 h-1 bg-primary/40 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                  <span>{t('hero.swipe')}</span>
                </div>
                
                {/* Price Badge - أنيق وبسيط */}
                <div className="mt-6 flex justify-center">
                  {priceLoading ? (
                    <Skeleton className="w-64 h-20" />
                  ) : (
                    <div className="relative inline-flex items-center gap-3 bg-gradient-to-r from-primary/20 via-white to-secondary/20 backdrop-blur-sm rounded-2xl px-6 py-4 border-2 border-primary/40 shadow-[0_8px_30px_rgba(139,195,74,0.25)] hover:shadow-[0_10px_40px_rgba(139,195,74,0.35)] transition-all duration-300 group">
                      {/* السعر القديم */}
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-muted-foreground">{t('hero.was')}</span>
                        <span className="text-lg line-through text-muted-foreground font-semibold">{formatPrice(ORIGINAL_PRICE)}</span>
                      </div>
                      
                      {/* فاصل */}
                      <div className="w-px h-12 bg-gradient-to-b from-transparent via-primary/50 to-transparent"></div>
                      
                      {/* السعر الجديد */}
                      <div className="flex flex-col items-start">
                        <span className="text-xs text-primary font-semibold">{t('hero.now')}</span>
                        <span className="text-3xl font-extrabold bg-gradient-primary bg-clip-text text-transparent">
                          {formatPrice(productPrice)}
                        </span>
                      </div>
                      
                      {/* دائرة التوفير - صغيرة وأنيقة */}
                      <div className="absolute -top-3 -right-3 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-sm font-bold shadow-lg animate-pulse border-2 border-white">
                        -{Math.round(((ORIGINAL_PRICE - productPrice) / ORIGINAL_PRICE) * 100)}%
                      </div>
                      
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
                    </div>
                  )}
                </div>
              </div>
              
               {/* Floating Badges - Improved Design */}
                {/* علامة "وفر" - تصميم محسن */}
                <div className={`absolute -top-3 lg:-top-4 ${language === 'ar' ? '-left-3 lg:-left-4' : '-right-3 lg:-right-4'} bg-gradient-to-br from-red-500 via-red-600 to-pink-600 text-white rounded-full w-18 h-18 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center font-bold text-sm lg:text-base shadow-[0_8px_30px_rgb(239,68,68,0.5)] animate-bounce-in z-30 border-4 border-white/30 hover:scale-110 transition-transform duration-300`}>
                  <div className="text-center">
                    <div className="text-xs lg:text-sm">🔥 وفر</div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold">{Math.round(((ORIGINAL_PRICE - productPrice) / ORIGINAL_PRICE) * 100)}%</div>
                  </div>
                </div>
                
                {/* علامة "جديد" - تصميم محسن */}
                <div className={`absolute -top-3 lg:-top-4 ${language === 'ar' ? '-right-3 lg:-right-4' : '-left-3 lg:-left-4'} bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-500 text-gray-900 rounded-full w-18 h-18 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center font-bold text-sm sm:text-base lg:text-lg shadow-[0_8px_30px_rgb(234,179,8,0.5)] animate-bounce-in z-30 border-4 border-white/30 hover:scale-110 transition-transform duration-300`}>
                  ⭐ {t('hero.new')}
               </div>
            </div>
          </div>
        </div>

        {/* Product Gallery Section */}
        <div className="py-12 sm:py-16 lg:py-20 space-y-8 lg:space-y-12">
          <div className="text-center space-y-3 lg:space-y-4 px-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">{t('hero.gallery.title')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
              {t('hero.gallery.description')}
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="mobile-grid px-4">
            
            {/* Certificates */}
            <Card className="bg-gradient-to-br from-primary/10 via-white to-secondary/10 border-2 border-primary/40 overflow-hidden hover:scale-105 hover:shadow-[0_10px_40px_rgba(139,195,74,0.35)] transition-all duration-300 group">
              <OptimizedImage 
                src="/lovable-uploads/34e3ec2a-fc02-4dc5-832e-8e3c95d538bc.png" 
                alt="Seven Green Safety and Quality Certificates"
                className="w-full h-64 object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                width={371}
                height={371}
              />
              <CardContent className="p-4 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
                <h3 className="text-foreground font-semibold mb-2">{t('gallery.certificates.title')}</h3>
                <p className="text-muted-foreground text-sm">{t('gallery.certificates.desc')}</p>
              </CardContent>
            </Card>

            {/* Product Stats */}
            <Card className="bg-gradient-to-br from-primary/10 via-white to-secondary/10 border-2 border-primary/40 overflow-hidden hover:scale-105 hover:shadow-[0_10px_40px_rgba(139,195,74,0.35)] transition-all duration-300 group">
              <OptimizedImage 
                src="/lovable-uploads/0c009587-187a-4c47-8318-01d391fab457.png" 
                alt="إحصائيات فعالية سيفن جرين"
                className="w-full h-64 object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                width={371}
                height={256}
              />
              <CardContent className="p-4 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
                <h3 className="text-foreground font-semibold mb-2">{t('gallery.effectiveness.title')}</h3>
                <p className="text-muted-foreground text-sm">{t('gallery.effectiveness.desc')}</p>
              </CardContent>
            </Card>

            {/* Hair Problems */}
            <Card className="bg-gradient-to-br from-primary/10 via-white to-secondary/10 border-2 border-primary/40 overflow-hidden hover:scale-105 hover:shadow-[0_10px_40px_rgba(139,195,74,0.35)] transition-all duration-300 group">
              <OptimizedImage 
                src="/lovable-uploads/3c289658-bf58-4017-b4dd-1233f018534f.png" 
                alt="مشاكل الشعر التي يعالجها سيفن جرين"
                className="w-full h-64 object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                width={371}
                height={256}
              />
              <CardContent className="p-4 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
                <h3 className="text-foreground font-semibold mb-2">{t('gallery.hair.problems.title')}</h3>
                <p className="text-muted-foreground text-sm">{t('gallery.hair.problems.desc')}</p>
              </CardContent>
            </Card>

            {/* Natural Ingredients */}
            <Card className="bg-gradient-to-br from-primary/10 via-white to-secondary/10 border-2 border-primary/40 overflow-hidden hover:scale-105 hover:shadow-[0_10px_40px_rgba(139,195,74,0.35)] transition-all duration-300 group">
              <OptimizedImage 
                src="/lovable-uploads/e811e78f-3694-4fda-bc61-637c435f2623.png" 
                alt="المكونات الطبيعية في سيفن جرين"
                className="w-full h-64 object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                width={371}
                height={256}
              />
              <CardContent className="p-4 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
                <h3 className="text-foreground font-semibold mb-2">{t('gallery.natural.ingredients.title')}</h3>
                <p className="text-muted-foreground text-sm">{t('gallery.natural.ingredients.desc')}</p>
              </CardContent>
            </Card>

            {/* Hair Care Benefits */}
            <Card className="bg-gradient-to-br from-primary/10 via-white to-secondary/10 border-2 border-primary/40 overflow-hidden hover:scale-105 hover:shadow-[0_10px_40px_rgba(139,195,74,0.35)] transition-all duration-300 group">
              <OptimizedImage 
                src="/lovable-uploads/04d3f7fc-1557-4bb3-801f-dcb481c7e7c4.png" 
                alt="فوائد العناية بالشعر من سيفن جرين"
                className="w-full h-64 object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                width={371}
                height={256}
              />
              <CardContent className="p-4 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
                <h3 className="text-foreground font-semibold mb-2">{t('gallery.comprehensive.benefits.title')}</h3>
                <p className="text-muted-foreground text-sm">{t('gallery.comprehensive.benefits.desc')}</p>
              </CardContent>
            </Card>

            {/* Product Comparison */}
            <Card className="bg-gradient-to-br from-primary/10 via-white to-secondary/10 border-2 border-primary/40 overflow-hidden hover:scale-105 hover:shadow-[0_10px_40px_rgba(139,195,74,0.35)] transition-all duration-300 group">
              <OptimizedImage 
                src="/lovable-uploads/6bf5c396-1aac-4f59-a75e-36012a8524d9.png" 
                alt="مقارنة سيفن جرين مع المنتجات الأخرى"
                className="w-full h-64 object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                width={371}
                height={256}
              />
              <CardContent className="p-4 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
                <h3 className="text-foreground font-semibold mb-2">{t('gallery.natural.excellence.title')}</h3>
                <p className="text-muted-foreground text-sm">{t('gallery.natural.excellence.desc')}</p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Product Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-8 lg:mt-12 px-4">
            
            {/* Usage Instructions */}
            <Card className="bg-gradient-to-br from-primary/10 via-white to-secondary/10 border-2 border-primary/40 overflow-hidden hover:shadow-[0_10px_40px_rgba(139,195,74,0.35)] transition-all duration-300 group">
              <OptimizedImage 
                src="/lovable-uploads/6e004fdb-9c1b-47d6-80df-179d406e3a27.png" 
                alt="طريقة استخدام سيفن جرين"
                className="w-full h-80 object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                width={574}
                height={320}
              />
              <CardContent className="p-6 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
                <h3 className="text-foreground font-semibold text-xl mb-3">{t('gallery.usage.instructions.title')}</h3>
                <p className="text-muted-foreground">{t('gallery.usage.instructions.desc')}</p>
              </CardContent>
            </Card>

            {/* Special Offer */}
            <Card className="bg-gradient-to-br from-primary/10 via-white to-secondary/10 border-2 border-primary/40 overflow-hidden hover:shadow-[0_10px_40px_rgba(139,195,74,0.35)] transition-all duration-300 group">
              <OptimizedImage 
                src="/lovable-uploads/8eb13276-b714-49ad-b518-70389a31bb9e.png" 
                alt="عرض خاص على سيفن جرين"
                className="w-full h-80 object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                width={574}
                height={320}
              />
              <CardContent className="p-6 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
                <h3 className="text-foreground font-semibold text-xl mb-3">{t('gallery.special.offer.title')}</h3>
                <p className="text-muted-foreground">{t('gallery.special.offer.desc')}</p>
                <Link to="/order">
                  <Button className="mt-4 bg-gradient-secondary hover:scale-105 transition-all">
                    {t('hero.buy.now')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default ProductHero;