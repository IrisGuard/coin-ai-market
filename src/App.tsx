
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { SpeedInsights } from '@vercel/speed-insights/react';
import Index from "./pages/Index";
import ProfilePage from "./pages/Profile";
import CoinDetailsPage from "./pages/CoinDetails";
import UploadPage from "./pages/CoinUpload";
import MarketplacePage from "./pages/ActiveMarketplace";
import DashboardPage from "./pages/Dashboard";
import StorePage from "./pages/DealerStorePage";
import CreateStorePage from "./pages/CreateStorePage";
import AuctionPage from "./pages/Auctions";
import AuthPage from "./pages/Auth";
import SettingsPage from "./pages/SettingsPage";
import AboutPage from "./pages/AboutPage";
import MarketplacePanelPage from "./pages/MarketplacePanelPage";
import AdminPanelPage from "./pages/AdminPanelPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/coin/:id" element={<CoinDetailsPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/marketplace/panel" element={<MarketplacePanelPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/store/:id" element={<StorePage />} />
            <Route path="/create-store" element={<CreateStorePage />} />
            <Route path="/auction/:id" element={<AuctionPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/admin" element={<AdminPanelPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <SpeedInsights />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
