
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TenantProvider } from "@/contexts/TenantContext";
import { AdminProvider } from "@/contexts/AdminContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminKeyboardHandler from "@/components/admin/AdminKeyboardHandler";
import { validateEnvironment } from "@/utils/envCheck";
import Index from "./pages/Index";
import Upload from "./pages/Upload";
import CoinUpload from "./pages/CoinUpload";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Marketplace from "./pages/Marketplace";
import CoinDetails from "./pages/CoinDetails";
import AdminSetup from "./pages/AdminSetup";
import Profile from "./pages/Profile";
import Portfolio from "./pages/Portfolio";
import Auctions from "./pages/Auctions";
import Watchlist from "./pages/Watchlist";
import Favorites from "./pages/Favorites";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Transactions from "./pages/Transactions";
import SellHistory from "./pages/SellHistory";
import Notifications from "./pages/Notifications";
import Support from "./pages/Support";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

// Validate environment variables on app start
try {
  validateEnvironment();
} catch (error) {
  console.error('Environment validation failed:', error);
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on 404s
        if (error instanceof Error && error.message.includes('404')) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TenantProvider>
        <AuthProvider>
          <AdminProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                {/* Hidden admin keyboard handler - no visible UI elements */}
                <AdminKeyboardHandler />
                
                <div className="min-h-screen bg-white pt-16">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/login" element={<Auth />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/coin/:id" element={<CoinDetails />} />
                    
                    {/* Protected routes that require authentication */}
                    <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
                    <Route path="/upload-coin" element={<ProtectedRoute><CoinUpload /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
                    <Route path="/auctions" element={<ProtectedRoute><Auctions /></ProtectedRoute>} />
                    <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
                    <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                    <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
                    <Route path="/sell-history" element={<ProtectedRoute><SellHistory /></ProtectedRoute>} />
                    <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                    <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
                    
                    {/* Admin routes */}
                    <Route path="/admin-setup" element={<AdminSetup />} />
                    <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                    
                    {/* Catch-all route for 404 pages */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </AdminProvider>
        </AuthProvider>
      </TenantProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
