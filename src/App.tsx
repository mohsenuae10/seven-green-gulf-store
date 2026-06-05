import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LanguageProvider from "./providers/LanguageProvider";
import { CartProvider } from "@/contexts/CartContext";
import { ChatBot } from "@/components/ChatBot";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Order from "./pages/Order";
import Product from "./pages/Product";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Benefits from "./pages/Benefits";
import Ingredients from "./pages/Ingredients";
import HowToUse from "./pages/HowToUse";
import Reviews from "./pages/Reviews";
import FAQPage from "./pages/FAQPage";
import Compare from "./pages/Compare";
import Privacy from "./pages/Privacy";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/benefits" element={<Benefits />} />
            <Route path="/ingredients" element={<Ingredients />} />
            <Route path="/how-to-use" element={<HowToUse />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/product" element={<Navigate to="/products" replace />} />
            <Route path="/order" element={<Order />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatBot />
        </BrowserRouter>
      </TooltipProvider>
      </CartProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
