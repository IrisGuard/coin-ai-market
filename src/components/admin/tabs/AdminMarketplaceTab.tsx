
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Store, TrendingUp, Users, Package, DollarSign } from 'lucide-react';

interface MarketplaceData {
  earnings?: {
    total: number;
  };
}

const AdminMarketplaceTab = () => {
  // Get marketplace stats
  const { data: marketplaceStats, isLoading } = useQuery({
    queryKey: ['marketplace-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_dashboard_stats');
      if (error) throw error;
      return data as MarketplaceData;
    },
  });

  // Get marketplace listings
  const { data: listings, isLoading: listingsLoading } = useQuery({
    queryKey: ['marketplace-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select(`
          *,
          coins (
            name,
            year,
            price,
            user_id,
            profiles!coins_user_id_fkey (name)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
  });

  // Get stores
  const { data: stores, isLoading: storesLoading } = useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select(`
          *,
          profiles!stores_user_id_fkey (name, verified_dealer)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Marketplace Management</h3>
          <p className="text-sm text-muted-foreground">Monitor marketplace activity, listings, and dealer stores</p>
        </div>
      </div>

      {/* Marketplace Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Stores</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stores?.filter(store => store.is_active).length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stores?.filter(store => store.verified).length || 0} verified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{listings?.filter(listing => listing.status === 'active').length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {listings?.length || 0} total listings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{marketplaceStats?.earnings?.total?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">lifetime earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Listing Price</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{Math.round((listings?.reduce((acc, listing) => acc + (listing.starting_price || 0), 0) || 0) / (listings?.length || 1))}
            </div>
            <p className="text-xs text-muted-foreground">across all listings</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Listings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Marketplace Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {listingsLoading ? (
              <div className="text-center py-8">Loading listings...</div>
            ) : listings?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No marketplace listings found
              </div>
            ) : (
              listings?.map((listing) => (
                <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{listing.coins?.name || 'Unknown Coin'}</div>
                    <div className="text-sm text-muted-foreground">
                      Year: {listing.coins?.year} • Listed by: {listing.coins?.profiles?.name || 'Unknown'}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={listing.status === 'active' ? "default" : "secondary"}>
                        {listing.status}
                      </Badge>
                      <Badge variant="outline">{listing.listing_type}</Badge>
                      <Badge variant="outline">€{listing.starting_price}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dealer Stores */}
      <Card>
        <CardHeader>
          <CardTitle>Dealer Stores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {storesLoading ? (
              <div className="text-center py-8">Loading stores...</div>
            ) : stores?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No dealer stores found
              </div>
            ) : (
              stores?.map((store) => (
                <div key={store.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{store.name}</div>
                    <div className="text-sm text-muted-foreground">{store.description}</div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={store.is_active ? "default" : "secondary"}>
                        {store.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant={store.verified ? "default" : "outline"}>
                        {store.verified ? "Verified" : "Unverified"}
                      </Badge>
                      <Badge variant="outline">
                        Owner: {store.profiles?.name || 'Unknown'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      Manage Store
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMarketplaceTab;
