
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MarketplaceStats {
  total: number;
  auctions: number;
  featured: number;
  totalValue: number;
  activeUsers: number;
}

export const useMarketplaceStats = () => {
  const [stats, setStats] = useState<MarketplaceStats>({
    total: 0,
    auctions: 0,
    featured: 0,
    totalValue: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch marketplace statistics using direct queries
      const [
        totalCoinsResult,
        auctionsResult,
        featuredResult,
        priceDataResult,
        activeUsersResult
      ] = await Promise.all([
        supabase
          .from('coins')
          .select('*', { count: 'exact', head: true })
          .eq('authentication_status', 'verified'),
        
        supabase
          .from('coins')
          .select('*', { count: 'exact', head: true })
          .eq('is_auction', true)
          .eq('authentication_status', 'verified'),
        
        supabase
          .from('coins')
          .select('*', { count: 'exact', head: true })
          .eq('featured', true)
          .eq('authentication_status', 'verified'),
        
        supabase
          .from('coins')
          .select('price')
          .eq('authentication_status', 'verified'),
        
        supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
      ]);

      if (totalCoinsResult.error) {
        console.error('Error fetching total coins:', totalCoinsResult.error);
      }
      if (auctionsResult.error) {
        console.error('Error fetching auctions:', auctionsResult.error);
      }
      if (featuredResult.error) {
        console.error('Error fetching featured coins:', featuredResult.error);
      }
      if (priceDataResult.error) {
        console.error('Error fetching price data:', priceDataResult.error);
      }
      if (activeUsersResult.error) {
        console.error('Error fetching active users:', activeUsersResult.error);
      }

      const totalValue = priceDataResult.data?.reduce((sum, coin) => sum + (coin.price || 0), 0) || 0;

      setStats({
        total: totalCoinsResult.count || 0,
        auctions: auctionsResult.count || 0,
        featured: featuredResult.count || 0,
        totalValue,
        activeUsers: activeUsersResult.count || 0
      });

    } catch (error: any) {
      console.error('Error fetching marketplace stats:', error);
      setError(error.message);
      toast.error('Failed to load marketplace statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { stats, loading, error, refetch: fetchStats };
};
