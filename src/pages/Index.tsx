import ProductHero from "@/components/ProductHero";
import ProductFeatures from "@/components/ProductFeatures";
import ProductIngredients from "@/components/ProductIngredients";
import CustomerReviews from "@/components/CustomerReviews";
import FAQ from "@/components/FAQ";
import TrustBadges from "@/components/TrustBadges";
import MobileNav from "@/components/MobileNav";
import MobileOptimized from "@/components/MobileOptimized";

const Index = () => {
  return (
    <MobileOptimized className="min-h-screen">
      <MobileNav />
      <ProductHero />
      <TrustBadges />
      <ProductIngredients />
      <ProductFeatures />
      <CustomerReviews />
      <FAQ />
    </MobileOptimized>
  );
};

export default Index;
