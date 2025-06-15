
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import CategoryPage from "./pages/CategoryPage";
import CoinDetails from "./pages/CoinDetails";
import Dashboard from "./pages/Dashboard";
import AdminPanelPage from "./pages/AdminPanelPage";
import DealerPage from "./pages/DealerPage";
import DualAnalysis from "./pages/DualAnalysis";
import Auth from "./pages/Auth";
import Auctions from "./pages/Auctions";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";

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
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/coin/:id" element={<CoinDetails />} />
              <Route path="/auctions" element={<Auctions />} />
              <Route path="/analysis" element={<DualAnalysis />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/payment-success/:transactionId?" element={<PaymentSuccess />} />
              <Route path="/payment-failure/:transactionId?" element={<PaymentFailure />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminPanelPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dealer"
                element={
                  <ProtectedRoute requireDealer>
                    <DealerPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AdminProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
