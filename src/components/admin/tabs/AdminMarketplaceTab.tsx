
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, TrendingUp, Users, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminMarketplaceTab = () => {
  const { data: marketplaceStats, isLoading } = useQuery({
    queryKey: ['marketplace-stats'],
    queryFn: async () => {
      const [storesResult, listingsResult, transactionsResult] = await Promise.all([
        supabase.from('stores').select('*', { count: 'exact', head: true }),
        supabase.from('marketplace_listings').select('*', { count: 'exact', head: true }),
        supabase.from('payment_transactions').select('amount').eq('status', 'completed')
      ]);

      const totalRevenue = transactionsResult.data?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

      return {
        total_stores: storesResult.count || 0,
        total_listings: listingsResult.count || 0,
        total_revenue: totalRevenue,
        active_stores: storesResult.count || 0
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-coin-purple"></div>
      </div>
    );
  }

  const data = marketplaceStats || {
    total_stores: 0,
    total_listings: 0,
    total_revenue: 0,
    active_stores: 0
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Marketplace Management</h3>
          <p className="text-sm text-muted-foreground">Monitor marketplace activity and stores</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.total_stores}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.total_listings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.total_revenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Stores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.active_stores}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminMarketplaceTab;
