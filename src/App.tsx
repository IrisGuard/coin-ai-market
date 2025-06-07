
// Force GitHub sync - Updated at 2025-01-09 to ensure proper deployment
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import ActiveMarketplace from "./pages/ActiveMarketplace";
import CoinUpload from "./pages/CoinUpload";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import CoinDetails from "./pages/CoinDetails";
import Auctions from "./pages/Auctions";
import CoinSale from "./pages/CoinSale";
import NotFound from "./pages/NotFound";
import EnhancedSearch from "./pages/EnhancedSearch";
import MobileAIFeatures from '@/pages/MobileAIFeatures';
import AIFeatures from './pages/AIFeatures';
import { AdminProvider } from "@/contexts/AdminContext";
import AdminKeyboardHandler from "@/components/admin/AdminKeyboardHandler";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <BrowserRouter>
            <AuthProvider>
              <AdminProvider>
                <ErrorBoundary>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/coins" element={<Index />} />
                    <Route path="/marketplace" element={<ActiveMarketplace />} />
                    <Route path="/marketplace-old" element={<Marketplace />} />
                    <Route path="/search" element={<EnhancedSearch />} />
                    <Route path="/upload" element={<CoinUpload />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/coin/:id" element={<CoinDetails />} />
                    <Route path="/auctions" element={<Auctions />} />
                    <Route path="/sell/:id" element={<CoinSale />} />
                    <Route path="/mobile-ai" element={<MobileAIFeatures />} />
                    <Route path="/ai-features" element={<AIFeatures />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <AdminKeyboardHandler />
                </ErrorBoundary>
              </AdminProvider>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </TooltipProvider>
      <Toaster />
      <Sonner />
    </QueryClientProvider>
  );
}

export default App;
