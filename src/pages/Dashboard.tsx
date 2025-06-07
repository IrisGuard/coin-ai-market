
import { usePageView } from '@/hooks/usePageView';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, DollarSign, Heart, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import SmartPortfolioAI from '@/components/dashboard/SmartPortfolioAI';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStatsGrid from '@/components/dashboard/DashboardStatsGrid';
import DashboardTabsContent from '@/components/dashboard/DashboardTabsContent';

const Dashboard = () => {
  usePageView();
  const { user } = useAuth();
  const { stats, watchlistItems, recentTransactions, favorites } = useDashboardData();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader userName={user?.user_metadata?.name} />
        
        <div className="mt-8">
          <SmartPortfolioAI />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.user_metadata?.full_name || 'Collector'}!
              </h1>
              <p className="text-gray-600">Manage your coins, track your favorites, and monitor your sales.</p>
            </div>

            <DashboardStatsGrid stats={stats} />

            <Tabs defaultValue="watchlist" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="watchlist" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Watchlist
                </TabsTrigger>
                <TabsTrigger value="transactions" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Transactions
                </TabsTrigger>
                <TabsTrigger value="favorites" className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Favorites
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <DashboardTabsContent 
                watchlistItems={watchlistItems}
                recentTransactions={recentTransactions}
                favorites={favorites}
              />
            </Tabs>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
