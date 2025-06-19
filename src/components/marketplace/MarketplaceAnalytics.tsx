
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMarketplace } from '@/hooks/useMarketplace';
import { TrendingUp, DollarSign, Package, Gavel } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const MarketplaceAnalytics = () => {
  const { stats, statsLoading } = useMarketplace();

  // Real data for charts from actual transactions and coins
  const { data: salesData = [] } = useQuery({
    queryKey: ['sales-data'],
    queryFn: async () => {
      const { data: transactions } = await supabase
        .from('payment_transactions')
        .select('amount, created_at, status')
        .eq('status', 'completed')
        .order('created_at', { ascending: true });

      // Group by month
      const monthlyData = transactions?.reduce((acc: any[], transaction) => {
        const month = new Date(transaction.created_at).toLocaleString('default', { month: 'short' });
        const existing = acc.find(item => item.month === month);
        if (existing) {
          existing.sales += 1;
          existing.revenue += Number(transaction.amount);
        } else {
          acc.push({ 
            month, 
            sales: 1, 
            revenue: Number(transaction.amount) 
          });
        }
        return acc;
      }, []) || [];

      return monthlyData.slice(-6); // Last 6 months
    }
  });

  const { data: categoryData = [] } = useQuery({
    queryKey: ['category-data'],
    queryFn: async () => {
      const { data: coins } = await supabase
        .from('coins')
        .select('category, price');

      // Group by category
      const categoryStats = coins?.reduce((acc: any[], coin) => {
        const category = coin.category || 'Unknown';
        const existing = acc.find(item => item.category === category);
        if (existing) {
          existing.count += 1;
          existing.value += Number(coin.price || 0);
        } else {
          acc.push({ 
            category: category.charAt(0).toUpperCase() + category.slice(1), 
            count: 1, 
            value: Number(coin.price || 0) 
          });
        }
        return acc;
      }, []) || [];

      return categoryStats.slice(0, 5); // Top 5 categories
    }
  });

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_listings || 0}</div>
            <p className="text-xs text-muted-foreground">Active on marketplace</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Auctions</CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active_auctions || 0}</div>
            <p className="text-xs text-muted-foreground">Currently bidding</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats?.total_value?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">Combined listing value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats?.average_price?.toFixed(0) || '0'}
            </div>
            <p className="text-xs text-muted-foreground">Per coin</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No sales data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No category data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Trending Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Trending Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {stats?.trending_categories?.map((category, index) => (
              <div key={category} className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">#{index + 1}</div>
                <div className="text-sm font-medium capitalize">{category}</div>
              </div>
            )) || Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-muted-foreground">-</div>
                <div className="text-sm text-muted-foreground">No data</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketplaceAnalytics;
