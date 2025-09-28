import ProductHero from "@/components/ProductHero";
import ProductFeatures from "@/components/ProductFeatures";
import MobileNav from "@/components/MobileNav";
import MobileOptimized from "@/components/MobileOptimized";

const Index = () => {
  return (
    <MobileOptimized className="min-h-screen">
      <MobileNav />
      <ProductHero />
      <ProductFeatures />
    </MobileOptimized>
  );
};

export default Index;
