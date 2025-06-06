
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useEnhancedFavorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchFavorites();
      subscribeToFavoriteChanges();
    }
  }, [user?.id]);

  const fetchFavorites = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('coin_id')
        .eq('user_id', user.id);

      if (error) throw error;
      
      setFavorites(data?.map(f => f.coin_id) || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        title: "Error",
        description: "Failed to load favorites",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToFavoriteChanges = () => {
    if (!user?.id) return;

    const channel = supabase
      .channel('user_favorites_changes')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_favorites',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setFavorites(prev => [...prev, payload.new.coin_id]);
          } else if (payload.eventType === 'DELETE') {
            setFavorites(prev => prev.filter(id => id !== payload.old.coin_id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const addToFavorites = async (coinId: string) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add favorites",
        variant: "destructive"
      });
      return false;
    }

    if (favorites.includes(coinId)) return true;

    try {
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          coin_id: coinId
        });

      if (error) throw error;

      // Optimistic update
      setFavorites(prev => [...prev, coinId]);
      
      toast({
        title: "Added to Favorites",
        description: "Coin has been added to your favorites!",
      });

      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast({
        title: "Error",
        description: "Failed to add to favorites",
        variant: "destructive"
      });
      return false;
    }
  };

  const removeFromFavorites = async (coinId: string) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('coin_id', coinId);

      if (error) throw error;

      // Optimistic update
      setFavorites(prev => prev.filter(id => id !== coinId));
      
      toast({
        title: "Removed from Favorites",
        description: "Coin has been removed from your favorites",
      });

      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast({
        title: "Error",
        description: "Failed to remove from favorites",
        variant: "destructive"
      });
      return false;
    }
  };

  const toggleFavorite = async (coinId: string) => {
    if (favorites.includes(coinId)) {
      return await removeFromFavorites(coinId);
    } else {
      return await addToFavorites(coinId);
    }
  };

  const isFavorite = (coinId: string) => favorites.includes(coinId);

  return {
    favorites,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    favoritesCount: favorites.length
  };
};
