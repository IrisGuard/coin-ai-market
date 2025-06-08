
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { initializeSecurity } from "@/lib/securityInitializer";
import { useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavigationBreadcrumb from "@/components/navigation/NavigationBreadcrumb";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CoinUpload from "./pages/CoinUpload";
import CategoryPage from "./pages/CategoryPage";
import ActiveMarketplace from "./pages/ActiveMarketplace";
import AdminPanelPage from "./pages/AdminPanelPage";
import MarketplacePanelPage from "./pages/MarketplacePanelPage";
import CoinDetails from "./pages/CoinDetails";
import Auctions from "./pages/Auctions";
import AIFeatures from "./pages/AIFeatures";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize security systems
    initializeSecurity().then((result) => {
      console.log('Security initialization complete:', result);
    }).catch((error) => {
      console.error('Security initialization failed:', error);
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <BrowserRouter>
            <AuthProvider>
              <AdminProvider>
                <div className="min-h-screen bg-background font-sans antialiased">
                  <NavigationBreadcrumb />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/marketplace" element={<ActiveMarketplace />} />
                    <Route path="/auctions" element={<Auctions />} />
                    <Route path="/ai-features" element={<AIFeatures />} />
                    <Route 
                      path="/auth" 
                      element={
                        <ProtectedRoute requireAuth={false}>
                          <Auth />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/profile" 
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/upload" 
                      element={
                        <ProtectedRoute>
                          <CoinUpload />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedRoute>
                          <AdminPanelPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/marketplace/panel" 
                      element={
                        <ProtectedRoute>
                          <MarketplacePanelPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/coin/:id" 
                      element={<CoinDetails />} 
                    />
                    <Route path="/category/:category" element={<CategoryPage />} />
                  </Routes>
                </div>
                <Toaster />
                <Sonner />
              </AdminProvider>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
