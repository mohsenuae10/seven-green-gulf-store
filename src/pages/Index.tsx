import { lazy, Suspense } from "react";
import ProductHero from "@/components/ProductHero";
import MobileNav from "@/components/MobileNav";
import MobileOptimized from "@/components/MobileOptimized";

// Lazy load below-the-fold components to reduce initial bundle size
const ProductFeatures = lazy(() => import("@/components/ProductFeatures"));

const Index = () => {
  return (
    <MobileOptimized className="min-h-screen">
      <MobileNav />
      <ProductHero />
      <Suspense fallback={
        <div className="py-20 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading features...</div>
        </div>
      }>
        <ProductFeatures />
      </Suspense>
    </MobileOptimized>
  );
};

export default Index;
