
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Search, Star, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Coin {
  id: string;
  name: string;
  year: number;
  price: number;
  rarity: string;
  grade: string;
  image: string;
  featured: boolean;
  authentication_status: string;
  user_id: string;
  created_at: string;
  profiles?: {
    name: string;
  };
}

const AdminCoinsTab = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchCoins = async () => {
    try {
      const { data, error } = await supabase
        .from('coins')
        .select(`
          *,
          profiles:user_id (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoins(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch coins: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCoin = async (coinId: string) => {
    if (!confirm('Are you sure you want to delete this coin?')) return;

    try {
      const { error } = await supabase
        .from('coins')
        .delete()
        .eq('id', coinId);

      if (error) throw error;

      setCoins(coins.filter(coin => coin.id !== coinId));
      
      toast({
        title: "Success",
        description: "Coin deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete coin: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateCoinStatus = async (coinId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('coins')
        .update({ authentication_status: status })
        .eq('id', coinId);

      if (error) throw error;

      setCoins(coins.map(coin => 
        coin.id === coinId ? { ...coin, authentication_status: status } : coin
      ));

      toast({
        title: "Success",
        description: `Coin ${status} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update coin status: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleToggleFeatured = async (coinId: string, featured: boolean) => {
    try {
      const { error } = await supabase
        .from('coins')
        .update({ featured })
        .eq('id', coinId);

      if (error) throw error;

      setCoins(coins.map(coin => 
        coin.id === coinId ? { ...coin, featured } : coin
      ));

      toast({
        title: "Success",
        description: `Coin ${featured ? 'featured' : 'unfeatured'} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update coin: " + error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  const filteredCoins = coins.filter(coin => {
    const matchesSearch = coin.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || coin.authentication_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="p-4">Loading coins...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Coin Management</h3>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search coins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredCoins.map((coin) => (
          <Card key={coin.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img 
                    src={coin.image} 
                    alt={coin.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <div className="font-medium">{coin.name}</div>
                    <div className="text-sm text-gray-500">
                      {coin.year} • Grade: {coin.grade} • ${coin.price.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant={
                          coin.authentication_status === 'verified' ? 'default' :
                          coin.authentication_status === 'pending' ? 'secondary' : 'destructive'
                        }
                      >
                        {coin.authentication_status}
                      </Badge>
                      {coin.featured && (
                        <Badge variant="outline" className="text-yellow-600">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      <Badge variant="outline">{coin.rarity}</Badge>
                      <span className="text-xs text-gray-400">
                        by {coin.profiles?.name || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleFeatured(coin.id, !coin.featured)}
                    className={coin.featured ? 'text-yellow-600' : ''}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateCoinStatus(coin.id, 'verified')}
                    className="text-green-600"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateCoinStatus(coin.id, 'rejected')}
                    className="text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteCoin(coin.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCoins.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {coins.length === 0 ? 'No coins found.' : 'No coins found matching your criteria.'}
        </div>
      )}
    </div>
  );
};

export default AdminCoinsTab;
