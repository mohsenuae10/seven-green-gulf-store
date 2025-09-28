import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import LanguageProvider from "./providers/LanguageProvider";
import Index from "./pages/Index";
import Order from "./pages/Order";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";

// Lazy load heavy/admin components to reduce initial bundle size
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/product-details" element={
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
                <ProductDetails />
              </Suspense>
            } />
            <Route path="/order" element={<Order />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/auth" element={
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
                <Auth />
              </Suspense>
            } />
            <Route path="/admin" element={
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
                <Admin />
              </Suspense>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
