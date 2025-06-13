
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, ShoppingCart, TrendingUp, Users, DollarSign, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const AdminMarketplaceSection = () => {
  const marketplaceTables = [
    {
      name: 'marketplace_listings',
      description: 'All marketplace coin listings',
      records: '3,456',
      status: 'active',
      icon: Package,
      revenue: '$45,678'
    },
    {
      name: 'marketplace_stats',
      description: 'Marketplace performance metrics',
      records: '365',
      status: 'active',
      icon: TrendingUp,
      revenue: 'Analytics'
    },
    {
      name: 'marketplace_tenants',
      description: 'Multi-tenant marketplace configurations',
      records: '12',
      status: 'active',
      icon: Store,
      revenue: 'Config'
    },
    {
      name: 'stores',
      description: 'Dealer store configurations',
      records: '234',
      status: 'active',
      icon: ShoppingCart,
      revenue: '$123,456'
    }
  ];

  const marketplaceStats = [
    { label: 'Total Listings', value: '3,456', icon: Package, color: 'text-blue-600' },
    { label: 'Active Stores', value: '234', icon: Store, color: 'text-green-600' },
    { label: 'Monthly Revenue', value: '$169,134', icon: DollarSign, color: 'text-emerald-600' },
    { label: 'Active Buyers', value: '1,789', icon: Users, color: 'text-purple-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Marketplace Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {marketplaceStats.map((stat) => {
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
                details: 'Premium Coins Ltd. registered as verified dealer',
                timestamp: '2 minutes ago',
                type: 'store',
                status: 'success'
              },
              {
                activity: 'High-Value Listing',
                details: '1909-S VDB Lincoln Cent listed for $1,250',
                timestamp: '15 minutes ago',
                type: 'listing',
                status: 'featured'
              },
              {
                activity: 'Bulk Import Completed',
                details: '247 coins imported by Rare Coin Gallery',
                timestamp: '1 hour ago',
                type: 'bulk',
                status: 'completed'
              },
              {
                activity: 'Store Verification',
                details: 'Heritage Coins completed KYC verification',
                timestamp: '2 hours ago',
                type: 'verification',
                status: 'approved'
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' || activity.status === 'approved' ? 'bg-green-500' :
                    activity.status === 'featured' ? 'bg-blue-500' :
                    activity.status === 'completed' ? 'bg-purple-500' : 'bg-gray-500'
                  }`} />
                  <div>
                    <p className="font-medium">{activity.activity}</p>
                    <p className="text-sm text-muted-foreground">{activity.details}</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {activity.timestamp}
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
