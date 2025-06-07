
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { 
  Users, 
  Store, 
  Coins, 
  Gavel, 
  TrendingUp, 
  Star,
  Settings,
  Shield,
  Activity
} from 'lucide-react';

const AdminPanel = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Admin keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key === 'a') {
        e.preventDefault();
        window.location.href = '/admin';
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Fetch admin stats
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [usersRes, storesRes, coinsRes, auctionsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('stores').select('id', { count: 'exact' }),
        supabase.from('coins').select('id', { count: 'exact' }),
        supabase.from('coins').select('id', { count: 'exact' }).eq('is_auction', true)
      ]);

      return {
        users: usersRes.count || 0,
        stores: storesRes.count || 0,
        coins: coinsRes.count || 0,
        auctions: auctionsRes.count || 0
      };
    }
  });

  // Fetch users
  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  // Fetch stores
  const { data: stores = [] } = useQuery({
    queryKey: ['admin-stores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select(`
          *,
          profiles!stores_user_id_fkey (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  // Fetch coins
  const { data: coins = [] } = useQuery({
    queryKey: ['admin-coins'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coins')
        .select(`
          *,
          profiles!coins_user_id_fkey (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    }
  });

  // Update coin status mutation
  const updateCoinStatus = useMutation({
    mutationFn: async ({ coinId, status }: { coinId: string; status: string }) => {
      const { error } = await supabase
        .from('coins')
        .update({ authentication_status: status })
        .eq('id', coinId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coins'] });
      toast({
        title: "Success",
        description: "Coin status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update coin status",
        variant: "destructive",
      });
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-red-600" />
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <p className="text-gray-600">
              Comprehensive platform management and oversight
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats?.users || 0}</p>
                    <p className="text-gray-600 text-sm">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Store className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats?.stores || 0}</p>
                    <p className="text-gray-600 text-sm">Active Stores</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Coins className="w-8 h-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats?.coins || 0}</p>
                    <p className="text-gray-600 text-sm">Total Coins</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Gavel className="w-8 h-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats?.auctions || 0}</p>
                    <p className="text-gray-600 text-sm">Active Auctions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="stores">Stores</TabsTrigger>
              <TabsTrigger value="coins">Coins</TabsTrigger>
              <TabsTrigger value="auctions">Auctions</TabsTrigger>
            </TabsList>

            {/* Users Tab */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Reputation</TableHead>
                        <TableHead>Verified Dealer</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.name || user.full_name || 'Unknown'}
                          </TableCell>
                          <TableCell>{user.email || 'No email'}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              {user.reputation || 0}
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.verified_dealer ? (
                              <Badge variant="default">Verified</Badge>
                            ) : (
                              <Badge variant="secondary">Standard</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Stores Tab */}
            <TabsContent value="stores">
              <Card>
                <CardHeader>
                  <CardTitle>Store Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Store Name</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Shipping Options</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stores.map((store) => (
                        <TableRow key={store.id}>
                          <TableCell className="font-medium">{store.name}</TableCell>
                          <TableCell>
                            {store.profiles?.name || store.profiles?.email || 'Unknown'}
                          </TableCell>
                          <TableCell>
                            {store.verified ? (
                              <Badge variant="default">Verified</Badge>
                            ) : (
                              <Badge variant="secondary">Pending</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {store.shipping_options?.length || 0} options
                          </TableCell>
                          <TableCell>
                            {new Date(store.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Coins Tab */}
            <TabsContent value="coins">
              <Card>
                <CardHeader>
                  <CardTitle>Coin Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {coins.map((coin) => (
                        <TableRow key={coin.id}>
                          <TableCell>
                            <img 
                              src={coin.image} 
                              alt={coin.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{coin.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{coin.category}</Badge>
                          </TableCell>
                          <TableCell>${coin.price}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                coin.authentication_status === 'verified' ? 'default' :
                                coin.authentication_status === 'rejected' ? 'destructive' : 'secondary'
                              }
                            >
                              {coin.authentication_status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {coin.profiles?.name || 'Unknown User'}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateCoinStatus.mutate({ 
                                  coinId: coin.id, 
                                  status: 'verified' 
                                })}
                                disabled={updateCoinStatus.isPending}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateCoinStatus.mutate({ 
                                  coinId: coin.id, 
                                  status: 'rejected' 
                                })}
                                disabled={updateCoinStatus.isPending}
                              >
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Auctions Tab */}
            <TabsContent value="auctions">
              <Card>
                <CardHeader>
                  <CardTitle>Auction Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Coin</TableHead>
                        <TableHead>Current Bid</TableHead>
                        <TableHead>Reserve Price</TableHead>
                        <TableHead>Ends At</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Seller</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {coins.filter(coin => coin.is_auction).map((auction) => (
                        <TableRow key={auction.id}>
                          <TableCell className="font-medium">{auction.name}</TableCell>
                          <TableCell>${auction.price}</TableCell>
                          <TableCell>
                            {auction.reserve_price ? `$${auction.reserve_price}` : 'No Reserve'}
                          </TableCell>
                          <TableCell>
                            {auction.auction_end ? 
                              new Date(auction.auction_end).toLocaleDateString() : 
                              'Not Set'
                            }
                          </TableCell>
                          <TableCell>
                            <Badge variant="default">Active</Badge>
                          </TableCell>
                          <TableCell>
                            {auction.profiles?.name || 'Unknown'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
