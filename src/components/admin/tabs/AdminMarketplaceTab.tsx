
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Store, 
  TrendingUp, 
  Users, 
  DollarSign,
  Package,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const AdminMarketplaceTab = () => {
  // Mock marketplace data
  const marketplaceStats = {
    total_listings: 15742,
    active_listings: 12894,
    total_stores: 234,
    active_stores: 198,
    transactions_24h: 156,
    revenue_24h: 45789.32,
    avg_listing_price: 127.45
  };

  const mockListings = [
    {
      id: '1',
      title: '1921 Morgan Silver Dollar MS65',
      seller: 'CoinDealer123',
      price: 245.00,
      listing_type: 'buy_now',
      status: 'active',
      views: 89,
      watchers: 12,
      created_at: '2024-06-10T10:30:00Z'
    },
    {
      id: '2',
      title: '1943 Steel Penny Error - Double Strike',
      seller: 'ErrorCoinExpert',
      price: 1850.00,
      listing_type: 'auction',
      status: 'active',
      views: 234,
      watchers: 45,
      created_at: '2024-06-09T15:20:00Z'
    },
    {
      id: '3',
      title: '1909-S VDB Lincoln Cent XF40',
      seller: 'VintageCoins',
      price: 675.00,
      listing_type: 'buy_now',
      status: 'sold',
      views: 156,
      watchers: 8,
      created_at: '2024-06-08T09:15:00Z'
    }
  ];

  const mockStores = [
    {
      id: '1',
      name: 'Premium Coin Gallery',
      owner: 'John Smith',
      verified: true,
      rating: 4.9,
      total_sales: 1247,
      active_listings: 89,
      revenue_30d: 15420.50
    },
    {
      id: '2',
      name: 'Error Coin Specialists',
      owner: 'Sarah Johnson',
      verified: true,
      rating: 4.8,
      total_sales: 856,
      active_listings: 67,
      revenue_30d: 23890.75
    },
    {
      id: '3',
      name: 'Vintage Collectibles',
      owner: 'Mike Chen',
      verified: false,
      rating: 4.6,
      total_sales: 432,
      active_listings: 34,
      revenue_30d: 8756.20
    }
  ];

  const getListingTypeBadge = (type: string) => {
    switch (type) {
      case 'auction': return <Badge className="bg-purple-100 text-purple-800">Auction</Badge>;
      case 'buy_now': return <Badge className="bg-green-100 text-green-800">Buy Now</Badge>;
      default: return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'sold': return <Badge className="bg-blue-100 text-blue-800">Sold</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Marketplace Management</h3>
          <p className="text-sm text-muted-foreground">Manage listings, stores, and marketplace activity</p>
        </div>
      </div>

      {/* Marketplace Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketplaceStats.total_listings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {marketplaceStats.active_listings.toLocaleString()} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Stores</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketplaceStats.active_stores}</div>
            <p className="text-xs text-muted-foreground">
              of {marketplaceStats.total_stores} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions (24h)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketplaceStats.transactions_24h}</div>
            <p className="text-xs text-muted-foreground">completed sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue (24h)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${marketplaceStats.revenue_24h.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">gross sales</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Listings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockListings.map((listing) => (
              <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{listing.title}</div>
                  <div className="text-sm text-muted-foreground">
                    Seller: {listing.seller} • Created: {new Date(listing.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2 mt-2">
                    {getListingTypeBadge(listing.listing_type)}
                    {getStatusBadge(listing.status)}
                    <Badge variant="outline">Views: {listing.views}</Badge>
                    <Badge variant="outline">Watchers: {listing.watchers}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-bold">${listing.price.toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Stores */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Stores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockStores.map((store) => (
              <div key={store.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {store.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{store.name}</span>
                      {store.verified && <Badge className="bg-blue-100 text-blue-800">Verified</Badge>}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Owner: {store.owner} • Rating: {store.rating}/5.0
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {store.total_sales} total sales • {store.active_listings} active listings
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${store.revenue_30d.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">30-day revenue</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMarketplaceTab;
