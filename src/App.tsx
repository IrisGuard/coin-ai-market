
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import AdminKeyboardHandler from "@/components/admin/AdminKeyboardHandler";
import DirectDealerButton from "@/components/DirectDealerButton";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ActiveMarketplace from "./pages/ActiveMarketplace";
import Auctions from "./pages/Auctions";
import CoinUpload from "./pages/CoinUpload";
import Profile from "./pages/Profile";
import AdminPanelPage from "./pages/AdminPanelPage";
import CoinDetails from "./pages/CoinDetails";
import DealerDirect from "./pages/DealerDirect";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import DealerUpgradePage from "./pages/DealerUpgradePage";
import CategoryPage from "./pages/CategoryPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <AdminProvider>
              <AdminKeyboardHandler />
              <DirectDealerButton />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/marketplace" element={<ActiveMarketplace />} />
                <Route path="/auctions" element={<Auctions />} />
                <Route path="/upload" element={<CoinUpload />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<AdminPanelPage />} />
                <Route path="/coin/:id" element={<CoinDetails />} />
                <Route path="/dealer-direct" element={<DealerDirect />} />
                <Route path="/dealer" element={<DealerDirect />} />
                <Route path="/dealer/upgrade" element={<DealerUpgradePage />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment-failure" element={<PaymentFailure />} />
                <Route path="/category/:category" element={<CategoryPage />} />
              </Routes>
            </AdminProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
