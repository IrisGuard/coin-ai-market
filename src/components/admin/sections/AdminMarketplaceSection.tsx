
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, ShoppingCart, TrendingUp, Users, DollarSign, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminMarketplaceSection = () => {
  // Fetch real marketplace statistics
  const { data: marketplaceStats, isLoading } = useQuery({
    queryKey: ['marketplace-section-stats'],
    queryFn: async () => {
      const [listingsResult, storesResult, statsResult, tenantsResult] = await Promise.all([
        supabase.from('marketplace_listings').select('*'),
        supabase.from('stores').select('*'),
        supabase.from('marketplace_stats').select('*').limit(1),
        supabase.from('marketplace_tenants').select('*')
      ]);

      const listings = listingsResult.data || [];
      const stores = storesResult.data || [];
      const stats = statsResult.data?.[0];
      const tenants = tenantsResult.data || [];

      // Calculate revenue from listings
      const totalRevenue = listings.reduce((sum, listing) => 
        sum + (listing.current_price || 0), 0
      );

      return {
        listings: listings.length,
        stores: stores.length,
        revenue: totalRevenue,
        tenants: tenants.length,
        activeListings: listings.filter(l => l.status === 'active').length,
        activeStores: stores.filter(s => s.is_active).length,
        stats
      };
    }
  });

  const marketplaceTables = [
    {
      name: 'marketplace_listings',
      description: 'All marketplace coin listings',
      records: marketplaceStats?.listings.toLocaleString() || '0',
      status: 'active',
      icon: Package,
      revenue: `$${marketplaceStats?.revenue.toLocaleString() || '0'}`
    },
    {
      name: 'marketplace_stats',
      description: 'Marketplace performance metrics',
      records: '1',
      status: 'active',
      icon: TrendingUp,
      revenue: 'Analytics'
    },
    {
      name: 'marketplace_tenants',
      description: 'Multi-tenant marketplace configurations',
      records: marketplaceStats?.tenants.toString() || '0',
      status: 'active',
      icon: Store,
      revenue: 'Config'
    },
    {
      name: 'stores',
      description: 'Dealer store configurations',
      records: marketplaceStats?.stores.toLocaleString() || '0',
      status: 'active',
      icon: ShoppingCart,
      revenue: `${marketplaceStats?.activeStores || 0} active`
    }
  ];

  const marketplaceStatsData = [
    { 
      label: 'Total Listings', 
      value: marketplaceStats?.listings.toLocaleString() || '0', 
      icon: Package, 
      color: 'text-blue-600' 
    },
    { 
      label: 'Active Stores', 
      value: marketplaceStats?.activeStores.toString() || '0', 
      icon: Store, 
      color: 'text-green-600' 
    },
    { 
      label: 'Total Value', 
      value: `$${marketplaceStats?.revenue.toLocaleString() || '0'}`, 
      icon: DollarSign, 
      color: 'text-emerald-600' 
    },
    { 
      label: 'Active Listings', 
      value: marketplaceStats?.activeListings.toString() || '0', 
      icon: Users, 
      color: 'text-purple-600' 
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Marketplace Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {marketplaceStatsData.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <p className="text-xs text-muted-foreground">Marketplace data</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Marketplace Tables */}
      <div className="grid gap-4 md:grid-cols-2">
        {marketplaceTables.map((table) => {
          const IconComponent = table.icon;
          return (
            <Card key={table.name} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">{table.name}</CardTitle>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {table.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{table.description}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm">
                    <span className="font-medium">{table.records}</span> records
                  </div>
                  <div className="text-sm font-medium text-blue-600">
                    {table.revenue}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Data
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Marketplace Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Marketplace Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                activity: 'New Store Registration',
                details: `${marketplaceStats?.stores || 0} total stores registered`,
                timestamp: 'Real-time data',
                type: 'store',
                status: 'success'
              },
              {
                activity: 'Active Listings',
                details: `${marketplaceStats?.activeListings || 0} listings currently active`,
                timestamp: 'Live count',
                type: 'listing',
                status: 'featured'
              },
              {
                activity: 'Total Value',
                details: `$${marketplaceStats?.revenue.toLocaleString() || '0'} in marketplace listings`,
                timestamp: 'Current value',
                type: 'bulk',
                status: 'completed'
              },
              {
                activity: 'Store Status',
                details: `${marketplaceStats?.activeStores || 0} stores are currently active`,
                timestamp: 'Real-time',
                type: 'verification',
                status: 'approved'
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'featured' ? 'bg-blue-500' :
                    activity.status === 'completed' ? 'bg-purple-500' :
                    'bg-orange-500'
                  }`} />
                  <div>
                    <p className="font-medium">{activity.activity}</p>
                    <p className="text-sm text-muted-foreground">{activity.details}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">{activity.timestamp}</div>
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMarketplaceSection;
