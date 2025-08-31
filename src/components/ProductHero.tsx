import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ShoppingCart, Leaf, Crown, Shield, Play, CheckCircle, Triangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useProductPrice } from "@/hooks/useProductPrice";
import { useCurrency } from "@/hooks/useCurrency";
import CurrencySwitcher from "@/components/CurrencySwitcher";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback, useEffect, useState } from 'react';

const ProductHero = () => {
  const { price: productPrice } = useProductPrice({ fallback: 299 });
  const { formatPrice } = useCurrency();
  
  // Carousel configuration
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      dragFree: true,
      containScroll: 'trimSnaps'
    }, 
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  const onInit = useCallback((emblaApi: any) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  const productImages = [
    {
      src: "/lovable-uploads/e7fefeeb-a395-4a12-b8a9-4dd8b1099ecb.png",
      alt: "سيفن جرين للعناية بالشعر"
    },
    {
      src: "/lovable-uploads/8d004a44-148f-471d-949f-6cc6b414bd1d.png", 
      alt: "سيفن جرين - عبوة طبيعية"
    },
    {
      src: "/lovable-uploads/b7fcf75b-d26d-4d69-971f-2b17e4dd3f6f.png",
      alt: "سيفن جرين - فوائد طبيعية"
    }
  ];
  
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Transparent Header */}
      <header className="absolute top-0 left-0 right-0 z-30 bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="mobile-container">
          <div className="flex items-center justify-between py-4 px-4 sm:px-0">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-glow border border-white/20 relative overflow-hidden">
                {/* Leaf Logo */}
                <img 
                  src="/lovable-uploads/9921e123-3994-40c0-8e5d-59f1265019f2.png" 
                  alt="Seven Green Logo" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div className="text-left">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wider font-english">
                  SEVEN GREEN
                </h1>
                <p className="text-xs text-secondary font-medium">سيفن جرين</p>
              </div>
            </div>

            {/* Currency Switcher */}
            <CurrencySwitcher variant="header" />
          </div>
        </div>
      </header>

      {/* Admin Link - Hidden on mobile, shown on desktop */}
      {/* Removed as it's now in the header */}

      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 opacity-20">
        <Leaf className="w-32 h-32 text-secondary animate-pulse" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-20">
        <Crown className="w-24 h-24 text-secondary animate-pulse" />
      </div>

      <div className="mobile-container relative z-10 pt-20 sm:pt-24 lg:pt-16">
        
        {/* Main Hero Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-4rem)] sm:min-h-screen py-8 sm:py-12 lg:py-20">
          
          {/* Product Content - Right side for RTL */}
          <div className="order-2 lg:order-1 space-y-6 lg:space-y-8 animate-slide-up text-center lg:text-right px-4 sm:px-0" dir="rtl">
            
            {/* Brand Badge */}
            <div className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm rounded-full px-6 py-2 border border-secondary/30">
              <Crown className="w-5 h-5 text-secondary" />
              <span className="text-secondary-foreground font-medium">منتج طبيعي 100%</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-3 lg:space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-7xl font-bold text-white leading-tight">
                سيفن جرين
                <span className="block text-lg sm:text-xl lg:text-2xl xl:text-3xl text-secondary font-semibold mt-1 font-english">
                  SEVEN GREEN
                </span>
                <span className="block text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-secondary font-light mt-2">
                  صابون السرو والأوسمان الطبيعي
                </span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                تركيبة طبيعية متقدمة من أوراق السرو ونبات الأوسمان، مُصممة لمنع تساقط الشعر والتحكم في الزيوت
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
              {[
                { icon: Leaf, title: "طبيعي 100%", desc: "مكونات عضوية صينية" },
                { icon: Shield, title: "آمن ومُختبر", desc: "معايير جودة عالمية" },
                { icon: Crown, title: "فاخر", desc: "تقنية صينية متقدمة" }
              ].map((feature, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 p-3 lg:p-4 text-center animate-bounce-in" style={{animationDelay: `${index * 0.2}s`}}>
                  <feature.icon className="w-6 h-6 lg:w-8 lg:h-8 text-secondary mx-auto mb-2" />
                  <h3 className="font-semibold text-white text-sm lg:text-base">{feature.title}</h3>
                  <p className="text-xs lg:text-sm text-white/70">{feature.desc}</p>
                </Card>
              ))}
            </div>

            {/* Rating */}
            <div className="flex items-center justify-center lg:justify-end gap-2">
              <div className="flex gap-1">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-secondary text-secondary" />
                ))}
              </div>
              <span className="text-white font-medium">4.9</span>
              <span className="text-white/70">(2,847 تقييم)</span>
            </div>

            {/* Success Stories */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-green-400" />
                <span className="text-white font-semibold text-sm lg:text-base">نتائج مُثبتة علمياً</span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 text-center">
                <div>
                  <div className="text-xl lg:text-2xl font-bold text-secondary">97%</div>
                  <div className="text-xs lg:text-sm text-white/70">تحسن في كثافة الشعر</div>
                </div>
                <div>
                  <div className="text-xl lg:text-2xl font-bold text-secondary">85%</div>
                  <div className="text-xs lg:text-sm text-white/70">تقليل التساقط</div>
                </div>
                <div>
                  <div className="text-xl lg:text-2xl font-bold text-secondary">92%</div>
                  <div className="text-xs lg:text-sm text-white/70">زيادة اللمعان</div>
                </div>
                <div>
                  <div className="text-xl lg:text-2xl font-bold text-secondary">4 أسابيع</div>
                  <div className="text-xs lg:text-sm text-white/70">لظهور النتائج</div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center lg:justify-end">
              <Link to="/order">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-secondary hover:scale-105 transition-all duration-300 shadow-glow text-base lg:text-lg px-8 lg:px-12 py-4 lg:py-6 rounded-full"
                >
                  <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6 ml-2" />
                  اشتر الآن - {formatPrice(productPrice)}
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-4 lg:gap-6 text-white/60 text-xs lg:text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3 lg:w-4 lg:h-4" />
                <span>ضمان الجودة</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-gradient-secondary"></div>
                <span>شحن مجاني</span>
              </div>
              <div className="flex items-center gap-2">
                <Crown className="w-3 h-3 lg:w-4 lg:h-4" />
                <span>منتج حصري</span>
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
                <div className="embla overflow-hidden rounded-2xl lg:rounded-3xl shadow-strong" ref={emblaRef}>
                  <div className="embla__container flex">
                    {productImages.map((image, index) => (
                      <div key={index} className="embla__slide flex-[0_0_100%] min-w-0">
                        <img 
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-auto block hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Carousel Dots */}
                <div className="flex justify-center gap-2 mt-6">
                  {scrollSnaps.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === selectedIndex 
                          ? 'bg-secondary scale-125 shadow-glow' 
                          : 'bg-white/40 hover:bg-white/60'
                      }`}
                      onClick={() => scrollTo(index)}
                      aria-label={`الانتقال إلى الصورة ${index + 1}`}
                    />
                  ))}
                </div>
                
                {/* Swipe indicator for mobile */}
                <div className="flex items-center justify-center gap-2 mt-3 text-white/60 text-xs sm:hidden">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                    <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                  <span>اسحب للتنقل</span>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 lg:-top-6 -right-4 lg:-right-6 bg-secondary text-secondary-foreground rounded-full w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center font-bold text-sm lg:text-lg shadow-medium animate-bounce-in z-30">
                جديد
              </div>
              <div className="absolute -bottom-3 lg:-bottom-4 -left-3 lg:-left-4 bg-white/20 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-medium z-30">
                <div className="text-white text-center">
                  <div className="text-xl lg:text-2xl font-bold text-secondary">{formatPrice(productPrice)}</div>
                  <div className="text-xs lg:text-sm">سعر المنتج</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Gallery Section */}
        <div className="py-12 sm:py-16 lg:py-20 space-y-8 lg:space-y-12">
          <div className="text-center space-y-3 lg:space-y-4 px-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">معرض المنتج</h2>
            <p className="text-white/80 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
              اكتشف جمال وفعالية سيفن جرين من خلال هذه المجموعة المتميزة من الصور
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="mobile-grid px-4">
            
            {/* Certificates */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden hover:scale-105 transition-transform duration-300">
              <img 
                src="/lovable-uploads/34e3ec2a-fc02-4dc5-832e-8e3c95d538bc.png" 
                alt="شهادات أمان وجودة سيفن جرين"
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-4 text-center">
                <h3 className="text-white font-semibold mb-2">الشهادات والأمان</h3>
                <p className="text-white/70 text-sm">منتج آمن ومُعتمد رسمياً</p>
              </CardContent>
            </Card>

            {/* Product Stats */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden hover:scale-105 transition-transform duration-300">
              <img 
                src="/lovable-uploads/0c009587-187a-4c47-8318-01d391fab457.png" 
                alt="إحصائيات فعالية سيفن جرين"
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-4 text-center">
                <h3 className="text-white font-semibold mb-2">الفعالية المُثبتة</h3>
                <p className="text-white/70 text-sm">نتائج علمية مُوثقة</p>
              </CardContent>
            </Card>

            {/* Hair Problems */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden hover:scale-105 transition-transform duration-300">
              <img 
                src="/lovable-uploads/3c289658-bf58-4017-b4dd-1233f018534f.png" 
                alt="مشاكل الشعر التي يعالجها سيفن جرين"
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-4 text-center">
                <h3 className="text-white font-semibold mb-2">مشاكل الشعر</h3>
                <p className="text-white/70 text-sm">حلول لجميع مشاكل الشعر</p>
              </CardContent>
            </Card>

            {/* Natural Ingredients */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden hover:scale-105 transition-transform duration-300">
              <img 
                src="/lovable-uploads/e811e78f-3694-4fda-bc61-637c435f2623.png" 
                alt="المكونات الطبيعية في سيفن جرين"
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-4 text-center">
                <h3 className="text-white font-semibold mb-2">المكونات الطبيعية</h3>
                <p className="text-white/70 text-sm">12 عشب طبيعي مختار بعناية</p>
              </CardContent>
            </Card>

            {/* Hair Care Benefits */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden hover:scale-105 transition-transform duration-300">
              <img 
                src="/lovable-uploads/04d3f7fc-1557-4bb3-801f-dcb481c7e7c4.png" 
                alt="فوائد العناية بالشعر من سيفن جرين"
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-4 text-center">
                <h3 className="text-white font-semibold mb-2">الفوائد الشاملة</h3>
                <p className="text-white/70 text-sm">عناية متكاملة للشعر</p>
              </CardContent>
            </Card>

            {/* Product Comparison */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden hover:scale-105 transition-transform duration-300">
              <img 
                src="/lovable-uploads/6bf5c396-1aac-4f59-a75e-36012a8524d9.png" 
                alt="مقارنة سيفن جرين مع المنتجات الأخرى"
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-4 text-center">
                <h3 className="text-white font-semibold mb-2">التميز الطبيعي</h3>
                <p className="text-white/70 text-sm">أفضل من المنتجات الكيميائية</p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Product Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-8 lg:mt-12 px-4">
            
            {/* Usage Instructions */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden">
              <img 
                src="/lovable-uploads/6e004fdb-9c1b-47d6-80df-179d406e3a27.png" 
                alt="طريقة استخدام سيفن جرين"
                className="w-full h-80 object-cover"
              />
              <CardContent className="p-6 text-center">
                <h3 className="text-white font-semibold text-xl mb-3">طريقة الاستخدام السهلة</h3>
                <p className="text-white/70">استخدام بسيط وفعال مع نتائج سريعة ومضمونة</p>
              </CardContent>
            </Card>

            {/* Special Offer */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden">
              <img 
                src="/lovable-uploads/8eb13276-b714-49ad-b518-70389a31bb9e.png" 
                alt="عرض خاص على سيفن جرين"
                className="w-full h-80 object-cover"
              />
              <CardContent className="p-6 text-center">
                <h3 className="text-white font-semibold text-xl mb-3">عرض خاص محدود</h3>
                <p className="text-white/70">اطلب الآن واحصل على هدايا مجانية مع المنتج</p>
                <Link to="/order">
                  <Button className="mt-4 bg-gradient-secondary hover:scale-105 transition-all">
                    اشتر الآن
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