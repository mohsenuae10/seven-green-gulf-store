import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LanguageProvider from "./providers/LanguageProvider";
import { CartProvider } from "@/contexts/CartContext";
import { ChatBot } from "@/components/ChatBot";
import ScrollToTop from "@/components/ScrollToTop";
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
import Privacy from "./pages/Privacy";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";

const queryClient = new QueryClient();

// All page routes — shared between Arabic and English
const pageRoutes = [
  { path: "",        element: <Index /> },
  { path: "about",   element: <About /> },
  { path: "benefits",    element: <Benefits /> },
  { path: "ingredients", element: <Ingredients /> },
  { path: "how-to-use",  element: <HowToUse /> },
  { path: "reviews",     element: <Reviews /> },
  { path: "faq",         element: <FAQPage /> },
  { path: "compare",     element: <Compare /> },
  { path: "products",    element: <Products /> },
  { path: "product/:id", element: <ProductDetail /> },
  { path: "order",           element: <Order /> },
  { path: "payment-success", element: <PaymentSuccess /> },
  { path: "privacy",         element: <Privacy /> },
];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* LanguageProvider is INSIDE BrowserRouter so it can read URL */}
          <LanguageProvider>
            <ScrollToTop />
            <Routes>
              {/* ── Arabic routes (default, no prefix) ── */}
              <Route path="/" element={<Index />} />
              {pageRoutes.filter(r => r.path).map(r => (
                <Route key={r.path} path={`/${r.path}`} element={r.element} />
              ))}

              {/* ── English routes (/en/ prefix) ── */}
              <Route path="/en" element={<Index />} />
              <Route path="/en/" element={<Index />} />
              {pageRoutes.filter(r => r.path).map(r => (
                <Route key={`en-${r.path}`} path={`/en/${r.path}`} element={r.element} />
              ))}

              {/* ── Non-localized routes ── */}
              <Route path="/auth"  element={<Auth />} />
              <Route path="/admin" element={<Admin />} />

              {/* ── 404 ── */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ChatBot />
          </LanguageProvider>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
