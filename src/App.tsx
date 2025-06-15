
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import Category from "./pages/Category";
import CoinDetails from "./pages/CoinDetails";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import DealerPanel from "./pages/DealerPanel";
import Analysis from "./pages/Analysis";
import Auth from "./pages/Auth";
import Auctions from "./pages/Auctions";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/category/:categoryName" element={<Category />} />
            <Route path="/coin/:id" element={<CoinDetails />} />
            <Route path="/auctions" element={<Auctions />} />
            <Route path="/analysis" element={<Analysis />} />
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
                <ProtectedRoute adminRequired>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dealer"
              element={
                <ProtectedRoute dealerRequired>
                  <DealerPanel />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
