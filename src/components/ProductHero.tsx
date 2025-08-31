import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ShoppingCart, Leaf, Crown, Shield, Settings, Play, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/seven-green-hero.jpg";
import productImage from "@/assets/seven-green-product-1.jpg";
import beautyImage from "@/assets/seven-green-beauty-1.jpg";
import collectionImage from "@/assets/seven-green-collection.jpg";
import transformationImage from "@/assets/hair-transformation.jpg";
import { useProductPrice } from "@/hooks/useProductPrice";

const ProductHero = () => {
  const { price: productPrice } = useProductPrice({ fallback: 299 });
  
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Admin Link */}
      <Link to="/auth" className="absolute top-4 left-4 z-20">
        <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
          <Settings className="w-4 h-4 ml-2" />
          لوحة التحكم
        </Button>
      </Link>

      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 opacity-20">
        <Leaf className="w-32 h-32 text-secondary animate-pulse" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-20">
        <Crown className="w-24 h-24 text-secondary animate-pulse" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Main Hero Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          
          {/* Product Content - Right side for RTL */}
          <div className="order-2 lg:order-1 space-y-8 animate-slide-up text-center lg:text-right" dir="rtl">
            
            {/* Brand Badge */}
            <div className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm rounded-full px-6 py-2 border border-secondary/30">
              <Crown className="w-5 h-5 text-secondary" />
              <span className="text-secondary-foreground font-medium">منتج طبيعي 100%</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                سيفن جرين
                <span className="block text-3xl lg:text-4xl text-secondary font-light mt-2">
                  للعناية المتقدمة بالشعر
                </span>
              </h1>
              
              <p className="text-xl text-white/90 max-w-2xl leading-relaxed">
                تركيبة فريدة مُستوحاة من الطب الصيني التقليدي، مُصممة خصيصاً لتقوية الشعر ومنع تساقطه
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: Leaf, title: "طبيعي 100%", desc: "مكونات عضوية صينية" },
                { icon: Shield, title: "آمن ومُختبر", desc: "معايير جودة عالمية" },
                { icon: Crown, title: "فاخر", desc: "تقنية صينية متقدمة" }
              ].map((feature, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 p-4 text-center animate-bounce-in" style={{animationDelay: `${index * 0.2}s`}}>
                  <feature.icon className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-white/70">{feature.desc}</p>
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
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-white font-semibold">نتائج مُثبتة علمياً</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-secondary">97%</div>
                  <div className="text-sm text-white/70">تحسن في كثافة الشعر</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">85%</div>
                  <div className="text-sm text-white/70">تقليل التساقط</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">92%</div>
                  <div className="text-sm text-white/70">زيادة اللمعان</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">4 أسابيع</div>
                  <div className="text-sm text-white/70">لظهور النتائج</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
              <Link to="/order">
                <Button 
                  size="lg" 
                  className="bg-gradient-secondary hover:scale-105 transition-all duration-300 shadow-glow text-lg px-8 py-4 rounded-full"
                >
                  <ShoppingCart className="w-5 h-5 ml-2" />
                  اطلب الآن - {productPrice} درهم
                </Button>
              </Link>
              <Link to="/product-details">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 rounded-full backdrop-blur-sm"
                >
                  <Play className="w-5 h-5 ml-2" />
                  شاهد النتائج
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center lg:justify-end gap-6 text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>ضمان الجودة</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-secondary"></div>
                <span>شحن مجاني</span>
              </div>
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4" />
                <span>منتج حصري</span>
              </div>
            </div>
          </div>

          {/* Product Images - Left side for RTL */}
          <div className="order-1 lg:order-2 relative animate-fade-in">
            <div className="relative">
              {/* Glowing effect behind image */}
              <div className="absolute inset-0 bg-gradient-secondary opacity-30 blur-3xl rounded-full transform rotate-12"></div>
              
              {/* Main product image */}
              <img 
                src={heroImage} 
                alt="سيفن جرين للعناية بالشعر" 
                className="relative z-10 w-full max-w-lg mx-auto rounded-3xl shadow-strong hover:scale-105 transition-transform duration-500"
              />
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 bg-secondary text-secondary-foreground rounded-full w-20 h-20 flex items-center justify-center font-bold text-lg shadow-medium animate-bounce-in">
                جديد
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-medium">
                <div className="text-white text-center">
                  <div className="text-2xl font-bold text-secondary">{productPrice}</div>
                  <div className="text-sm">درهم إماراتي</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Gallery Section */}
        <div className="py-20 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-white">معرض المنتج</h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              اكتشف جمال وفعالية سيفن جرين من خلال هذه المجموعة المتميزة من الصور
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Product Shot */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden hover:scale-105 transition-transform duration-300">
              <img 
                src={productImage} 
                alt="منتج سيفن جرين الأصلي"
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-4 text-center">
                <h3 className="text-white font-semibold mb-2">المنتج الأصلي</h3>
                <p className="text-white/70 text-sm">تصميم فاخر بمكونات طبيعية</p>
              </CardContent>
            </Card>

            {/* Beauty Shot */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden hover:scale-105 transition-transform duration-300">
              <img 
                src={beautyImage} 
                alt="نتائج سيفن جرين على الشعر"
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-4 text-center">
                <h3 className="text-white font-semibold mb-2">النتائج المذهلة</h3>
                <p className="text-white/70 text-sm">شعر صحي ولامع وقوي</p>
              </CardContent>
            </Card>

            {/* Collection */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden hover:scale-105 transition-transform duration-300">
              <img 
                src={collectionImage} 
                alt="مجموعة سيفن جرين الكاملة"
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-4 text-center">
                <h3 className="text-white font-semibold mb-2">المجموعة الفاخرة</h3>
                <p className="text-white/70 text-sm">تشكيلة متكاملة للعناية بالشعر</p>
              </CardContent>
            </Card>
          </div>

          {/* Before & After Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-4">شاهد الفرق بنفسك</h3>
              <p className="text-white/80">نتائج حقيقية من عملائنا الراضين</p>
            </div>
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src={transformationImage} 
                alt="قبل وبعد استخدام سيفن جرين"
                className="w-full h-auto"
              />
              <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold">
                نتائج خلال 4 أسابيع
              </div>
            </div>
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