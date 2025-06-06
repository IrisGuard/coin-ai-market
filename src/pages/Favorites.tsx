import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Heart, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CoinCard from '@/components/CoinCard';
import { usePageView } from '@/hooks/usePageView';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Favorites = () => {
  usePageView();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Get user's favorite coins with proper foreign key hint
  const { data: favoriteCoins, isLoading } = useQuery({
    queryKey: ['user-favorites', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          *,
          coins!user_favorites_coin_id_fkey(
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
            profiles!coins_user_id_fkey(
              id,
              name,
              reputation,
              verified_dealer,
              avatar_url
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

  // Remove from favorites mutation
  const removeFromFavorites = useMutation({
    mutationFn: async (favoriteId: string) => {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('id', favoriteId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-favorites'] });
      toast({
        title: "Removed from Favorites",
        description: "Coin has been removed from your favorites.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || 'Failed to remove from favorites',
        variant: "destructive",
      });
    },
  });

  const filteredFavorites = favoriteCoins?.filter(favorite =>
    favorite.coins?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    favorite.coins?.country?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1 className="text-3xl font-bold text-gray-900">Favorite Coins</h1>
            <p className="text-gray-600 mt-2">Your collection of favorite coins ({favoriteCoins?.length || 0})</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search favorites..."
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

        {filteredFavorites.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {favoriteCoins?.length === 0 ? 'No favorite coins yet' : 'No coins match your search'}
              </h3>
              <p className="text-gray-600 mb-4">
                {favoriteCoins?.length === 0 
                  ? 'Heart coins you love to add them to your favorites.' 
                  : 'Try adjusting your search terms.'}
              </p>
              {favoriteCoins?.length === 0 && (
                <Button className="bg-brand-primary hover:bg-brand-primary/90">
                  Browse Marketplace
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFavorites.map((favorite) => (
              <div key={favorite.id} className="relative">
                {favorite.coins && <CoinCard coin={favorite.coins as any} />}
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 left-2 h-8 w-8 p-0"
                  onClick={() => removeFromFavorites.mutate(favorite.id)}
                  disabled={removeFromFavorites.isPending}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
                <div className="absolute top-2 right-2 bg-red-100 text-red-600 rounded-full p-1">
                  <Heart className="h-4 w-4 fill-current" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
