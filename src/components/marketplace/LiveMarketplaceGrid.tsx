
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import OptimizedCoinCard from '@/components/OptimizedCoinCard';
import TrendingCoins from './TrendingCoins';
import { useProductionActivation } from '@/hooks/useProductionActivation';
import { mapSupabaseCoinToCoin } from '@/types/coin';

const LiveMarketplaceGrid = () => {
  const { isActivated } = useProductionActivation();

  const { data: coins, isLoading, error } = useQuery({
    queryKey: ['marketplace-coins'],
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
        .eq('authentication_status', 'verified')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data ? data.map(mapSupabaseCoinToCoin) : [];
    },
    refetchInterval: 15000, // Live updates every 15 seconds
    enabled: true
  });

  const { data: featuredCoins } = useQuery({
    queryKey: ['featured-coins'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coins')
        .select('*')
        .eq('featured', true)
        .eq('authentication_status', 'verified')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data ? data.map(mapSupabaseCoinToCoin) : [];
    },
    refetchInterval: 30000 // Live updates every 30 seconds
  });

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Loading Live Market Data</h3>
        <p className="text-muted-foreground">
          Connecting to real-time marketplace feeds...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Trending Section */}
      <TrendingCoins />

      {/* Featured Coins */}
      {featuredCoins && featuredCoins.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-electric-red to-electric-orange bg-clip-text text-transparent">
              Featured Coins
            </h2>
            <span className="text-sm text-green-600 font-medium">
              LIVE • Real-time data
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredCoins.map((coin, index) => (
              <OptimizedCoinCard 
                key={coin.id} 
                coin={coin} 
                index={index} 
                priority={index < 4}
              />
            ))}
          </div>
        </section>
      )}

      {/* All Coins */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Live Marketplace</h2>
          <span className="text-sm text-green-600 font-medium">
            🟢 LIVE • Real-time updates
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : coins && coins.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {coins.map((coin, index) => (
              <OptimizedCoinCard 
                key={coin.id} 
                coin={coin} 
                index={index} 
                priority={index < 8}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">Platform is LIVE</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              All systems are operational and ready for live coin listings. 
              The AI Brain is connected and the marketplace is fully functional.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default LiveMarketplaceGrid;
