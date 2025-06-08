
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
      
      // Use the real database function to get marketplace stats
      const { data: marketplaceStats, error: statsError } = await supabase
        .rpc('get_marketplace_stats');

      if (statsError) {
        console.error('Error fetching marketplace stats:', statsError);
        // Fallback to individual queries if function fails
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

        const totalValue = priceDataResult.data?.reduce((sum, coin) => sum + (coin.price || 0), 0) || 0;

        setStats({
          total: totalCoinsResult.count || 0,
          auctions: auctionsResult.count || 0,
          featured: featuredResult.count || 0,
          totalValue,
          activeUsers: activeUsersResult.count || 0
        });
      } else {
        // Use the function result
        setStats({
          total: marketplaceStats?.listed_coins || 0,
          auctions: marketplaceStats?.active_auctions || 0,
          featured: 0, // This would need to be added to the function
          totalValue: marketplaceStats?.total_volume || 0,
          activeUsers: marketplaceStats?.registered_users || 0
        });
      }

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
