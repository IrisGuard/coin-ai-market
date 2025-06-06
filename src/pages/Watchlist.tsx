
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Eye, Trash2, Bell } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CoinCard from '@/components/CoinCard';
import { usePageView } from '@/hooks/usePageView';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Watchlist = () => {
  usePageView();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Get user's watchlist items
  const { data: watchlistItems, isLoading } = useQuery({
    queryKey: ['user-watchlist', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('watchlist')
        .select(`
          *,
          marketplace_listings!watchlist_listing_id_fkey(
            id,
            current_price,
            ends_at,
            status,
            listing_type,
            coins(
              id,
              name,
              year,
              grade,
              price,
              rarity,
              image,
              country,
              denomination,
              condition,
              user_id,
              created_at,
              profiles(
                id,
                name,
                reputation,
                verified_dealer,
                avatar_url
              )
            )
          )
        `)
        .eq('user_id', user?.id!)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Remove from watchlist mutation
  const removeFromWatchlist = useMutation({
    mutationFn: async (watchlistId: string) => {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('id', watchlistId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-watchlist'] });
      toast({
        title: "Removed from Watchlist",
        description: "Item has been removed from your watchlist.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || 'Failed to remove from watchlist',
        variant: "destructive",
      });
    },
  });

  const filteredWatchlist = watchlistItems?.filter(item =>
    item.marketplace_listings?.coins?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.marketplace_listings?.coins?.country?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[400px] pt-16">
          <div className="animate-spin h-8 w-8 border-4 border-brand-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Watchlist</h1>
            <p className="text-gray-600 mt-2">Keep track of coins you're interested in ({watchlistItems?.length || 0})</p>
          </div>
          <Button className="bg-brand-primary hover:bg-brand-primary/90">
            <Bell className="h-4 w-4 mr-2" />
            Set Alerts
          </Button>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search watchlist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {filteredWatchlist.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {watchlistItems?.length === 0 ? 'Your watchlist is empty' : 'No items match your search'}
              </h3>
              <p className="text-gray-600 mb-4">
                {watchlistItems?.length === 0 
                  ? 'Start watching coins you\'re interested in to track their progress.' 
                  : 'Try adjusting your search terms.'}
              </p>
              {watchlistItems?.length === 0 && (
                <Button className="bg-brand-primary hover:bg-brand-primary/90">
                  Browse Marketplace
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWatchlist.map((item) => (
              <div key={item.id} className="relative">
                {item.marketplace_listings?.coins && (
                  <CoinCard coin={item.marketplace_listings.coins} />
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 left-2 h-8 w-8 p-0"
                  onClick={() => removeFromWatchlist.mutate(item.id)}
                  disabled={removeFromWatchlist.isPending}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
                
                {/* Price alert badge */}
                {item.max_bid_alert && (
                  <div className="absolute bottom-2 left-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    Alert: ${item.max_bid_alert}
                  </div>
                )}
                
                {/* Current price badge */}
                {item.marketplace_listings?.current_price && (
                  <div className="absolute bottom-2 right-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    ${item.marketplace_listings.current_price}
                  </div>
                )}
                
                {/* Watch icon */}
                <div className="absolute top-2 right-2 bg-blue-100 text-blue-600 rounded-full p-1">
                  <Eye className="h-4 w-4" />
                </div>
                
                {/* Auction ending soon badge */}
                {item.marketplace_listings?.ends_at && 
                 new Date(item.marketplace_listings.ends_at) < new Date(Date.now() + 24 * 60 * 60 * 1000) && (
                  <Badge variant="destructive" className="absolute top-10 right-2">
                    Ending Soon
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
