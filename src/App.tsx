
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { initializeSecurity } from "@/lib/securityInitializer";
import { useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CoinUpload from "./pages/CoinUpload";
import CategoryPage from "./pages/CategoryPage";
import Admin from "./pages/Admin";

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
        <BrowserRouter>
          <AuthProvider>
            <AdminProvider>
              <div className="min-h-screen bg-background font-sans antialiased">
                <Routes>
                  <Route path="/" element={<Index />} />
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
                        <Admin />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/marketplace/:category" element={<CategoryPage />} />
                </Routes>
              </div>
              <Toaster />
              <Sonner />
            </AdminProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
