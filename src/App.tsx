
// Force GitHub sync - Updated at 2025-01-09 to ensure proper deployment
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import ActiveMarketplace from "./pages/ActiveMarketplace";
import DealerStorePage from "./pages/DealerStorePage";
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
import CategoryPage from './pages/CategoryPage';
import MarketplacePanel from './pages/MarketplacePanel';
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
                    <Route path="/" element={<Index />} />
                    <Route path="/marketplace" element={<ActiveMarketplace />} />
                    <Route path="/marketplace/panel" element={<MarketplacePanel />} />
                    <Route path="/dealer/:dealerId" element={<DealerStorePage />} />
                    <Route path="/search" element={<EnhancedSearch />} />
                    <Route path="/upload" element={
                      <ProtectedRoute requireAuth={true}>
                        <CoinUpload />
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard" element={
                      <ProtectedRoute requireAuth={true}>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute requireAuth={true}>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="/auth" element={
                      <ProtectedRoute requireAuth={false}>
                        <Auth />
                      </ProtectedRoute>
                    } />
                    <Route path="/coin/:id" element={<CoinDetails />} />
                    <Route path="/auctions" element={<Auctions />} />
                    <Route path="/sell/:id" element={
                      <ProtectedRoute requireAuth={true}>
                        <CoinSale />
                      </ProtectedRoute>
                    } />
                    <Route path="/mobile-ai" element={<MobileAIFeatures />} />
                    <Route path="/ai-features" element={<AIFeatures />} />
                    <Route path="/category/:category" element={<CategoryPage />} />
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
