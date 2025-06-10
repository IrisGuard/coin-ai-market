
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import Index from "@/pages/Index";
import AuthPage from "@/pages/AuthPage";
import AdminPanelPage from "@/pages/AdminPanelPage";
import DealerPanelPage from "@/pages/DealerPanelPage";
import MarketplacePanelPage from "@/pages/MarketplacePanelPage";
import SuperAdminPage from "@/pages/SuperAdminPage";
import SearchPage from "@/pages/SearchPage";
import CoinDetailsPage from "@/pages/CoinDetailsPage";
import AIAnalysisPage from "@/pages/AIAnalysisPage";
import ProfilePage from "@/pages/ProfilePage";

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
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/admin" element={<AdminPanelPage />} />
              <Route path="/dealer-panel" element={<DealerPanelPage />} />
              <Route path="/marketplace-panel" element={<MarketplacePanelPage />} />
              <Route path="/super-admin" element={<SuperAdminPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/coin/:id" element={<CoinDetailsPage />} />
              <Route path="/ai-analysis" element={<AIAnalysisPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </AdminProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
