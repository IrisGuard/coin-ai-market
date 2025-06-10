
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Coins, Search, Eye, Trash2, Star, DollarSign } from 'lucide-react';

const AdminCoinsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: coins, isLoading } = useQuery({
    queryKey: ['admin-coins', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('coins')
        .select(`
          *,
          profiles!coins_user_id_fkey (
            id,
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,country.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const toggleFeatured = useMutation({
    mutationFn: async ({ coinId, featured }: { coinId: string; featured: boolean }) => {
      const { error } = await supabase
        .from('coins')
        .update({ featured })
        .eq('id', coinId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coins'] });
      toast({
        title: "Coin Updated",
        description: "Coin featured status has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || 'Failed to update coin',
        variant: "destructive",
      });
    },
  });

  const deleteCoin = useMutation({
    mutationFn: async (coinId: string) => {
      const { error } = await supabase
        .from('coins')
        .delete()
        .eq('id', coinId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coins'] });
      toast({
        title: "Coin Deleted",
        description: "Coin has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || 'Failed to delete coin',
        variant: "destructive",
      });
    },
  });

  const totalCoins = coins?.length || 0;
  const featuredCoins = coins?.filter(coin => coin.featured)?.length || 0;
  const totalValue = coins?.reduce((sum, coin) => sum + (coin.price || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Coin Management</h3>
          <p className="text-sm text-muted-foreground">Manage all coin listings and featured status</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coins</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCoins}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Coins</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{featuredCoins}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search coins by name, description, or country..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Coins Table */}
      <Card>
        <CardHeader>
          <CardTitle>Coins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-b-2 border-coin-purple mx-auto mb-4"></div>
                <p>Loading coins...</p>
              </div>
            ) : coins?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No coins found
              </div>
            ) : (
              coins?.map((coin: any) => (
                <div key={coin.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={coin.image || '/placeholder.svg'} 
                      alt={coin.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <div className="font-medium">{coin.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {coin.year} • {coin.country} • Grade: {coin.grade}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Owner: {coin.profiles?.name || 'Unknown'}
                      </div>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">${coin.price}</Badge>
                        {coin.featured && <Badge variant="default">Featured</Badge>}
                        {coin.is_auction && <Badge variant="secondary">Auction</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/coin/${coin.id}`, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    <Button
                      variant={coin.featured ? "destructive" : "default"}
                      size="sm"
                      onClick={() => toggleFeatured.mutate({ 
                        coinId: coin.id, 
                        featured: !coin.featured 
                      })}
                      disabled={toggleFeatured.isPending}
                    >
                      <Star className="h-4 w-4" />
                      {coin.featured ? 'Unfeature' : 'Feature'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this coin?')) {
                          deleteCoin.mutate(coin.id);
                        }
                      }}
                      disabled={deleteCoin.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
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

export default AdminCoinsTab;
