
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Store, ShoppingCart, Gavel, TrendingUp, Users, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const MarketplaceManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('stores');

  const { data: stores, isLoading: storesLoading } = useQuery({
    queryKey: ['marketplace-stores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching stores:', error);
        throw error;
      }
      
      console.log('✅ Stores loaded:', data?.length);
      return data || [];
    }
  });

  const { data: listings, isLoading: listingsLoading } = useQuery({
    queryKey: ['marketplace-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select('*, coins(*)')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching listings:', error);
        throw error;
      }
      
      console.log('✅ Marketplace listings loaded:', data?.length);
      return data || [];
    }
  });

  const { data: auctions, isLoading: auctionsLoading } = useQuery({
    queryKey: ['auction-bids'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('auction_bids')
        .select('*, coins(*)')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching auctions:', error);
        throw error;
      }
      
      console.log('✅ Auction bids loaded:', data?.length);
      return data || [];
    }
  });

  const { data: marketStats, isLoading: statsLoading } = useQuery({
    queryKey: ['marketplace-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_stats')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error fetching marketplace stats:', error);
        throw error;
      }
      
      console.log('✅ Marketplace stats loaded:', data);
      return data;
    }
  });

  const filteredStores = stores?.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredListings = listings?.filter(listing => 
    listing.coins?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (storesLoading || listingsLoading || auctionsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stores?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active Stores</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{listings?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total Listings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{auctions?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active Auctions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{marketStats?.registered_users || 0}</div>
            <p className="text-xs text-muted-foreground">Registered Users</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-purple-600" />
            Marketplace Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="stores" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                Stores
              </TabsTrigger>
              <TabsTrigger value="listings" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Listings
              </TabsTrigger>
              <TabsTrigger value="auctions" className="flex items-center gap-2">
                <Gavel className="h-4 w-4" />
                Auctions
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-4 my-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <TabsContent value="stores">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Store Name</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Listings</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStores.map((store) => (
                    <TableRow key={store.id}>
                      <TableCell>
                        <div className="font-medium">{store.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {store.description?.substring(0, 50)}...
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{store.user_id.substring(0, 8)}...</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={store.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {store.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {listings?.filter(l => l.seller_id === store.user_id).length || 0}
                      </TableCell>
                      <TableCell>$0.00</TableCell>
                      <TableCell>
                        {new Date(store.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="listings">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredListings.map((listing) => (
                    <TableRow key={listing.id}>
                      <TableCell>
                        <div className="font-medium">{listing.coins?.name || 'Unknown'}</div>
                        <div className="text-sm text-muted-foreground">
                          {listing.coins?.year} • {listing.coins?.grade}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{listing.listing_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono">${listing.current_price}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(listing.status)}>
                          {listing.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {listing.coins?.views || 0}
                      </TableCell>
                      <TableCell>
                        {new Date(listing.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="auctions">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Current Bid</TableHead>
                    <TableHead>Bidder</TableHead>
                    <TableHead>Bids</TableHead>
                    <TableHead>Ends</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auctions?.map((auction) => (
                    <TableRow key={auction.id}>
                      <TableCell>
                        <div className="font-medium">{auction.coins?.name || 'Unknown'}</div>
                        <div className="text-sm text-muted-foreground">
                          Auction ID: {auction.auction_id?.substring(0, 8)}...
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-green-600">${auction.amount}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{auction.bidder_id.substring(0, 8)}...</Badge>
                      </TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>
                        <div className="text-sm">Active</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={auction.is_winning ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {auction.is_winning ? 'Winning' : 'Outbid'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Manage</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Transaction Volume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">${marketStats?.total_volume || 0}</div>
                    <p className="text-sm text-muted-foreground">Total marketplace volume</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Active Listings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{marketStats?.listed_coins || 0}</div>
                    <p className="text-sm text-muted-foreground">Currently listed items</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketplaceManager;
