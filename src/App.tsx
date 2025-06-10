
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import AdminPanelPage from "@/pages/AdminPanelPage";
import DealerPanelPage from "@/pages/DealerPanelPage";
import MarketplacePanelPage from "@/pages/MarketplacePanelPage";
import SuperAdminPage from "@/pages/SuperAdminPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AdminProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<AdminPanelPage />} />
              <Route path="/dealer-panel" element={<DealerPanelPage />} />
              <Route path="/marketplace-panel" element={<MarketplacePanelPage />} />
              <Route path="/super-admin" element={<SuperAdminPage />} />
            </Routes>
          </AdminProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
