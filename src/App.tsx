
import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { initializeEnhancedSecurity } from "@/lib/enhancedSecurityInitializer";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavigationBreadcrumb from "@/components/navigation/NavigationBreadcrumb";
import ErrorBoundaryWrapper from "@/components/ErrorBoundaryWrapper";
import AdminKeyboardHandler from "@/components/admin/AdminKeyboardHandler";
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
import DualAnalysis from "./pages/DualAnalysis";
import QuickAdminAccess from "@/components/admin/QuickAdminAccess";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize security systems after React is fully mounted
    const initSecurity = async () => {
      try {
        const result = await initializeEnhancedSecurity();
        console.log('Security initialization complete:', result);
      } catch (error) {
        console.error('Security initialization failed:', error);
      }
    };

    initSecurity();
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
                    <Route path="/" element={
                      <ErrorBoundaryWrapper>
                        <Index />
                      </ErrorBoundaryWrapper>
                    } />
                    <Route path="/marketplace" element={
                      <ErrorBoundaryWrapper>
                        <ActiveMarketplace />
                      </ErrorBoundaryWrapper>
                    } />
                    <Route path="/auctions" element={
                      <ErrorBoundaryWrapper>
                        <Auctions />
                      </ErrorBoundaryWrapper>
                    } />
                    <Route path="/ai-features" element={
                      <ErrorBoundaryWrapper>
                        <AIFeatures />
                      </ErrorBoundaryWrapper>
                    } />
                    <Route path="/dual-analysis" element={
                      <ErrorBoundaryWrapper>
                        <DualAnalysis />
                      </ErrorBoundaryWrapper>
                    } />
                    <Route 
                      path="/auth" 
                      element={
                        <ProtectedRoute requireAuth={false}>
                          <ErrorBoundaryWrapper>
                            <Auth />
                          </ErrorBoundaryWrapper>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <ErrorBoundaryWrapper>
                            <Dashboard />
                          </ErrorBoundaryWrapper>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/profile" 
                      element={
                        <ProtectedRoute>
                          <ErrorBoundaryWrapper>
                            <Profile />
                          </ErrorBoundaryWrapper>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/upload" 
                      element={
                        <ProtectedRoute requireDealer={true}>
                          <ErrorBoundaryWrapper>
                            <CoinUpload />
                          </ErrorBoundaryWrapper>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedRoute requireAdmin={true}>
                          <ErrorBoundaryWrapper>
                            <AdminPanelPage />
                          </ErrorBoundaryWrapper>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/marketplace/panel" 
                      element={
                        <ProtectedRoute>
                          <ErrorBoundaryWrapper>
                            <MarketplacePanelPage />
                          </ErrorBoundaryWrapper>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/coin/:id" 
                      element={
                        <ErrorBoundaryWrapper>
                          <CoinDetails />
                        </ErrorBoundaryWrapper>
                      } 
                    />
                    <Route path="/category/:category" element={
                      <ErrorBoundaryWrapper>
                        <CategoryPage />
                      </ErrorBoundaryWrapper>
                    } />
                  </Routes>
                </div>
                <Toaster />
                <Sonner />
                <AdminKeyboardHandler />
                <QuickAdminAccess />
              </AdminProvider>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
