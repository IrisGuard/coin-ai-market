
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
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  usePageView();
  const { user } = useAuth();
  const { data: coins } = useCoins();
  const { data: portfolioItems } = useUserPortfolio(user?.id);

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

  // Get recent activity for the user
  const { data: recentActivity } = useQuery({
    queryKey: ['recent-activity', user?.id],
    queryFn: async () => {
      const activities = [];
      
      // Get recent bids
      const { data: recentBids } = await supabase
        .from('bids')
        .select(`
          *,
          coins(name, image)
        `)
        .eq('user_id', user?.id!)
        .order('created_at', { ascending: false })
        .limit(3);

      if (recentBids) {
        activities.push(...recentBids.map(bid => ({
          type: 'bid',
          coin: bid.coins?.name || 'Unknown Coin',
          amount: `$${bid.amount}`,
          time: new Date(bid.created_at || '').toLocaleString(),
          id: bid.id
        })));
      }

      // Get recent favorites
      const { data: recentFavorites } = await supabase
        .from('user_favorites')
        .select(`
          *,
          coins(name, image)
        `)
        .eq('user_id', user?.id!)
        .order('created_at', { ascending: false })
        .limit(2);

      if (recentFavorites) {
        activities.push(...recentFavorites.map(fav => ({
          type: 'favorite',
          coin: fav.coins?.name || 'Unknown Coin',
          time: new Date(fav.created_at || '').toLocaleString(),
          id: fav.id
        })));
      }

      // Sort by time and return top 5
      return activities
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 5);
    },
    enabled: !!user?.id,
  });

  // Calculate real portfolio statistics
  const totalValue = portfolioItems?.reduce((sum, item) => 
    sum + (item.coins?.price || item.purchase_price || 0) * item.quantity, 0) || 0;
  const totalCoins = portfolioItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.user_metadata?.full_name || 'Collector'}!</p>
          </div>
          <Button className="bg-brand-primary hover:bg-brand-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Quick Action
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Your collection value
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coins Owned</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCoins}</div>
              <p className="text-xs text-muted-foreground">
                In your portfolio
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Watchlist</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{watchlistCount}</div>
              <p className="text-xs text-muted-foreground">
                Items being watched
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest coin marketplace activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity && recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'bid' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'favorite' ? 'bg-red-100 text-red-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {activity.type === 'bid' ? <Clock className="h-4 w-4" /> :
                         activity.type === 'favorite' ? <Heart className="h-4 w-4" /> :
                         <TrendingUp className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-medium">{activity.coin}</p>
                        <p className="text-sm text-gray-600">{activity.time}</p>
                      </div>
                    </div>
                    {activity.amount && (
                      <Badge variant="outline">{activity.amount}</Badge>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recent activity</p>
                  <p className="text-sm text-gray-500">Start bidding or favoriting coins to see activity here</p>
                </div>
              )}
            </CardContent>
          </Card>

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

        {/* Portfolio Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Overview</CardTitle>
            <CardDescription>Your collection at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            {portfolioItems && portfolioItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-primary">{totalCoins}</div>
                  <p className="text-sm text-gray-600">Total Coins</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">${totalValue.toLocaleString()}</div>
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
