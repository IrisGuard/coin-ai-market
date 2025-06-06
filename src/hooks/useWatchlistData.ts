
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CoinData {
  id: string;
  name: string;
  year: number;
  image: string;
  price: number;
  rarity: string;
  condition: string;
  country: string;
  is_auction: boolean;
  auction_end: string | null;
  views: number;
  user_id: string;
  profiles?: {
    name: string;
    reputation: number;
    verified_dealer: boolean;
  } | null;
}

interface WatchlistItem {
  id: string;
  listing_id: string;
  created_at: string;
  price_alert_enabled: boolean;
  target_price: number | null;
  price_change_percentage: number | null;
  coin: CoinData; // Make this required since we filter for valid coins
}

export const useWatchlistData = (userId?: string) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    const fetchWatchlistData = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      try {
        const { data: watchlistData, error } = await supabase
          .from('watchlist')
          .select(`
            *,
            coins!listing_id (
              id,
              name,
              year,
              image,
              price,
              rarity,
              condition,
              country,
              is_auction,
              auction_end,
              views,
              user_id,
              profiles!user_id (
                name,
                reputation,
                verified_dealer
              )
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Process the data and handle the coin relationship
        const processedWatchlist: WatchlistItem[] = (watchlistData || [])
          .filter((item: any) => 
            item.coins && 
            typeof item.coins === 'object' && 
            !Array.isArray(item.coins) &&
            'name' in item.coins &&
            item.coins.profiles &&
            typeof item.coins.profiles === 'object' &&
            !Array.isArray(item.coins.profiles) &&
            'name' in item.coins.profiles
          )
          .map((item: any) => ({
            ...item,
            coin: {
              ...item.coins,
              profiles: {
                name: item.coins.profiles.name,
                reputation: item.coins.profiles.reputation,
                verified_dealer: item.coins.profiles.verified_dealer
              },
              // Add previous_price calculation if needed
              previous_price: item.coins?.price || 0
            } as CoinData
          }));

        setWatchlistItems(processedWatchlist);

      } catch (error) {
        console.error('Error fetching watchlist:', error);
        toast({
          title: "Error",
          description: "Failed to load watchlist data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchlistData();
  }, [userId, toast]);

  // Calculate watchlist statistics
  const watchlistStats = useMemo(() => {
    const totalValue = watchlistItems.reduce((sum, item) => sum + (item.coin?.price || 0), 0);
    const auctionItems = watchlistItems.filter(item => item.coin?.is_auction).length;
    const priceDrops = 0; // Placeholder since we don't have price history yet
    const activeAlerts = watchlistItems.filter(item => item.price_alert_enabled).length;

    return {
      totalItems: watchlistItems.length,
      totalValue,
      auctionItems,
      priceDrops,
      activeAlerts
    };
  }, [watchlistItems]);

  return {
    watchlistItems,
    setWatchlistItems,
    watchlistStats,
    isLoading
  };
};
