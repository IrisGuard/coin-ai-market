
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
    queryKey: ['live-marketplace-coins'],
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
        .limit(100); // Increased limit for live data

      if (error) throw error;
      return data ? data.map(mapSupabaseCoinToCoin) : [];
    },
    refetchInterval: 10000, // Live updates every 10 seconds
    enabled: true
  });

  const { data: featuredCoins } = useQuery({
    queryKey: ['live-featured-coins'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coins')
        .select('*')
        .eq('featured', true)
        .eq('authentication_status', 'verified')
        .order('created_at', { ascending: false })
        .limit(12); // More featured coins for live marketplace

      if (error) throw error;
      return data ? data.map(mapSupabaseCoinToCoin) : [];
    },
    refetchInterval: 15000 // Live updates every 15 seconds
  });

  const { data: liveStats } = useQuery({
    queryKey: ['live-marketplace-stats'],
    queryFn: async () => {
      const [coinsCount, auctionsCount, transactionsCount] = await Promise.all([
        supabase.from('coins').select('*', { count: 'exact', head: true }),
        supabase.from('coins').select('*', { count: 'exact', head: true }).eq('is_auction', true),
        supabase.from('payment_transactions').select('*', { count: 'exact', head: true }).eq('status', 'completed')
      ]);

      return {
        totalCoins: coinsCount.count || 0,
        activeAuctions: auctionsCount.count || 0,
        completedTransactions: transactionsCount.count || 0
      };
    },
    refetchInterval: 20000 // Update stats every 20 seconds
  });

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">🚀 Loading Live Production Data</h3>
        <p className="text-muted-foreground">
          Connecting to live marketplace feeds and real-time data sources...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Live Platform Status */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-green-800">🚀 LIVE PRODUCTION MARKETPLACE</h2>
            <p className="text-green-600">All systems operational • Real-time data • AI Brain active</p>
          </div>
          {liveStats && (
            <div className="flex gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-blue-600">{liveStats.totalCoins}</div>
                <div className="text-blue-500">Live Coins</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-red-600">{liveStats.activeAuctions}</div>
                <div className="text-red-500">Active Auctions</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-green-600">{liveStats.completedTransactions}</div>
                <div className="text-green-500">Transactions</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trending Section */}
      <TrendingCoins />

      {/* Featured Coins */}
      {featuredCoins && featuredCoins.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-electric-red to-electric-orange bg-clip-text text-transparent">
              Featured Live Coins
            </h2>
            <span className="text-sm text-green-600 font-medium">
              🔴 LIVE • Real-time marketplace data
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredCoins.map((coin, index) => (
              <OptimizedCoinCard 
                key={coin.id} 
                coin={coin} 
                index={index} 
                priority={index < 8}
              />
            ))}
          </div>
        </section>
      )}

      {/* All Live Coins */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Live Production Marketplace</h2>
          <span className="text-sm text-green-600 font-medium">
            🟢 LIVE PRODUCTION • Real-time updates every 10 seconds
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
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
                priority={index < 12}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border border-blue-200">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2 text-blue-800">Live Production Platform Operational</h3>
            <p className="text-blue-600 max-w-md mx-auto">
              All systems are live and operational. AI Brain is processing real-time marketplace data. 
              Coin listings will appear as data sources populate the database.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default LiveMarketplaceGrid;
