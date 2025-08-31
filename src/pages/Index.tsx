import ProductHero from "@/components/ProductHero";
import ProductFeatures from "@/components/ProductFeatures";
import CustomerReviews from "@/components/CustomerReviews";
import MobileNav from "@/components/MobileNav";
import MobileOptimized from "@/components/MobileOptimized";

const Index = () => {
  return (
    <MobileOptimized className="min-h-screen">
      <MobileNav />
      <ProductHero />
      <ProductFeatures />
      <CustomerReviews />
    </MobileOptimized>
  );
};

export default Index;
