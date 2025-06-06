
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TenantProvider } from "@/contexts/TenantContext";
import { AdminProvider } from "@/contexts/AdminContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import AdminKeyboardHandler from "@/components/admin/AdminKeyboardHandler";
import { validateEnvironment } from "@/utils/envCheck";
import Index from "./pages/Index";
import Upload from "./pages/Upload";
import CoinUpload from "./pages/CoinUpload";
import Auth from "./pages/Auth";
import Marketplace from "./pages/Marketplace";
import CoinDetails from "./pages/CoinDetails";
import AdminSetup from "./pages/AdminSetup";

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
                
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/upload" element={<Upload />} />
                  <Route path="/upload-coin" element={<CoinUpload />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/login" element={<Auth />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/coin/:id" element={<CoinDetails />} />
                  <Route path="/admin" element={<AdminSetup />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </AdminProvider>
        </AuthProvider>
      </TenantProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
