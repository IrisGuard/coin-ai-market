
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { TenantProvider } from "@/contexts/TenantContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CoinDetails from "./pages/CoinDetails";
import Upload from "./pages/Upload";
import MobileUpload from "./pages/MobileUpload";
import CoinUpload from "./pages/CoinUpload";
import Marketplace from "./pages/Marketplace";
import NotFound from "./pages/NotFound";
import AdminSetup from "./pages/AdminSetup";
import ErrorBoundary from "./components/ErrorBoundary";
import { logAdminSetupInstructions } from "@/utils/adminUtils";

const queryClient = new QueryClient();

// Log admin setup instructions in development
if (process.env.NODE_ENV === 'development') {
  logAdminSetupInstructions();
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <ErrorBoundary>
            <AuthProvider>
              <AdminProvider>
                <TenantProvider>
                  <div className="min-h-screen bg-white">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/admin-setup" element={<AdminSetup />} />
                      <Route path="/coins/:id" element={<CoinDetails />} />
                      <Route path="/upload" element={<Upload />} />
                      <Route path="/mobile-upload" element={<MobileUpload />} />
                      <Route path="/coin-upload" element={<CoinUpload />} />
                      <Route path="/marketplace" element={<Marketplace />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                  <Toaster />
                  <Sonner />
                </TenantProvider>
              </AdminProvider>
            </AuthProvider>
          </ErrorBoundary>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
