
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  DollarSign, 
  Coins, 
  Eye, 
  Heart, 
  Clock, 
  Activity,
  Plus
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useCoins } from '@/hooks/useCoins';
import { usePageView } from '@/hooks/usePageView';
import { useUserPortfolio } from '@/hooks/useEnhancedDataSources';
import { useEnhancedDashboardStats } from '@/hooks/useEnhancedDashboardStats';
import EnhancedPortfolioStats from '@/components/dashboard/EnhancedPortfolioStats';
import EnhancedRecentActivity from '@/components/dashboard/EnhancedRecentActivity';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  usePageView();
  const { user } = useAuth();
  const { data: coins } = useCoins();
  const { data: portfolioItems } = useUserPortfolio(user?.id);
  const { stats, recentActivity, loading } = useEnhancedDashboardStats();

  // Get user's watchlist count
  const { data: watchlistCount } = useQuery({
    queryKey: ['watchlist-count', user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from('watchlist')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id!);
      return count || 0;
    },
    enabled: !!user?.id,
  });

  // Get user's active bids count
  const { data: activeBidsCount } = useQuery({
    queryKey: ['active-bids-count', user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from('bids')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id!)
        .eq('is_winning', true);
      return count || 0;
    },
    enabled: !!user?.id,
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Enhanced Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.user_metadata?.full_name || 'Collector'}!</p>
          </div>
          <Button className="bg-brand-primary hover:bg-brand-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Quick Action
          </Button>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
              <p className={`text-xs flex items-center gap-1 ${stats.profitPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.profitPercentage >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingUp className="h-3 w-3 rotate-180" />}
                {stats.profitPercentage >= 0 ? '+' : ''}{stats.profitPercentage.toFixed(2)}%
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profit/Loss</CardTitle>
              {stats.totalProfit >= 0 ? 
                <TrendingUp className="h-4 w-4 text-green-600" /> : 
                <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
              }
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.totalProfit >= 0 ? '+' : ''}${Math.abs(stats.totalProfit).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Total portfolio gain/loss
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coins Owned</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCoins}</div>
              <p className="text-xs text-muted-foreground">
                In your portfolio
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bids</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeBidsCount}</div>
              <p className="text-xs text-muted-foreground">
                Auctions in progress
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favorites</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{stats.favoriteCoins}</div>
              <p className="text-xs text-muted-foreground">Coins you love</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Watchlist</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{watchlistCount}</div>
              <p className="text-xs text-muted-foreground">Items being watched</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{stats.completedTransactions}</div>
              <p className="text-xs text-muted-foreground">Completed deals</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Portfolio Performance */}
        <EnhancedPortfolioStats stats={stats} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enhanced Recent Activity */}
          <EnhancedRecentActivity activities={recentActivity} loading={loading} />

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add New Coin to Portfolio
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Clock className="h-4 w-4 mr-2" />
                Create Auction Listing
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Browse New Arrivals
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Market Trends
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Overview</CardTitle>
            <CardDescription>Your collection at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            {portfolioItems && portfolioItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-primary">{stats.totalCoins}</div>
                  <p className="text-sm text-gray-600">Total Coins</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">${stats.totalValue.toLocaleString()}</div>
                  <p className="text-sm text-gray-600">Total Value</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">
                    {new Set(portfolioItems.map(item => item.coins?.country).filter(Boolean)).size}
                  </div>
                  <p className="text-sm text-gray-600">Countries</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Coins className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No coins in your portfolio yet</p>
                <p className="text-sm text-gray-500">Start collecting to see your portfolio overview</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
