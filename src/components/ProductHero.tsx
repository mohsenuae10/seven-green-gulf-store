import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, ShoppingCart, Leaf, Crown, Shield, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/seven-green-hero.jpg";
import { useProductPrice } from "@/hooks/useProductPrice";

const ProductHero = () => {
  const { price: productPrice } = useProductPrice({ fallback: 299 });
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
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
              تركيبة فريدة من المكونات الطبيعية لتغذية الشعر وتقويته من الجذور حتى الأطراف
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Leaf, title: "طبيعي 100%", desc: "مكونات عضوية" },
              { icon: Shield, title: "آمن", desc: "بدون مواد كيميائية" },
              { icon: Crown, title: "فاخر", desc: "جودة عالمية" }
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
                تعرف على المنتج
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

        {/* Product Image - Left side for RTL */}
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