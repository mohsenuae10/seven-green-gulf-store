import ProductHero from "@/components/ProductHero";
import ProductFeatures from "@/components/ProductFeatures";
import CustomerReviews from "@/components/CustomerReviews";

const Index = () => {
  return (
    <div className="min-h-screen">
      <ProductHero />
      <ProductFeatures />
      <CustomerReviews />
    </div>
  );
};

export default Index;
