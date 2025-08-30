import ProductHero from "@/components/ProductHero";
import ProductFeatures from "@/components/ProductFeatures";
import CustomerReviews from "@/components/CustomerReviews";
import OrderSection from "@/components/OrderSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <ProductHero />
      <ProductFeatures />
      <CustomerReviews />
      <OrderSection />
    </div>
  );
};

export default Index;
