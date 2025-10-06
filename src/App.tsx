import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LanguageProvider from "./providers/LanguageProvider";
import Index from "./pages/Index";
import Order from "./pages/Order";
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
            <Route path="/about" element={<About />} />
            <Route path="/benefits" element={<Benefits />} />
            <Route path="/ingredients" element={<Ingredients />} />
            <Route path="/how-to-use" element={<HowToUse />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/order" element={<Order />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
