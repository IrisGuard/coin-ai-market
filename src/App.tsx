
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TenantProvider } from "@/contexts/TenantContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { validateEnvironment } from "@/utils/envCheck";

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Upload from "./pages/Upload";
import MobileUpload from "./pages/MobileUpload";
import CoinDetails from "./pages/CoinDetails";
import Profile from "./pages/Profile";
import Marketplace from "./pages/Marketplace";
import Dashboard from "./pages/Dashboard";
import Auctions from "./pages/Auctions";
import Favorites from "./pages/Favorites";
import Watchlist from "./pages/Watchlist";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import Portfolio from "./pages/Portfolio";
import Notifications from "./pages/Notifications";
import Support from "./pages/Support";
import SellHistory from "./pages/SellHistory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  // Check environment variables
  validateEnvironment();

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ThemeProvider>
            <TenantProvider>
              <AuthProvider>
                <BrowserRouter>
                  <div className="min-h-screen bg-background font-sans antialiased">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/upload" element={<Upload />} />
                      <Route path="/mobile-upload" element={<MobileUpload />} />
                      <Route path="/coin/:id" element={<CoinDetails />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/marketplace" element={<Marketplace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/auctions" element={<Auctions />} />
                      <Route path="/favorites" element={<Favorites />} />
                      <Route path="/watchlist" element={<Watchlist />} />
                      <Route path="/transactions" element={<Transactions />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="/portfolio" element={<Portfolio />} />
                      <Route path="/notifications" element={<Notifications />} />
                      <Route path="/support" element={<Support />} />
                      <Route path="/sell-history" element={<SellHistory />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <PWAInstallPrompt />
                  </div>
                </BrowserRouter>
                <Toaster />
                <Sonner />
              </AuthProvider>
            </TenantProvider>
          </ThemeProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
