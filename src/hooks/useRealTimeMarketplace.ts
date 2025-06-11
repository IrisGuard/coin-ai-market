
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface MarketplaceData {
  totalListings: number;
  activeAuctions: number;
  avgPrice: number;
  newListings24h: number;
  endingSoon: number;
  topCategories: Array<{ name: string; count: number }>;
  recentActivity: Array<{
    id: string;
    type: 'listing' | 'bid' | 'sale';
    coinName: string;
    amount: number;
    timestamp: string;
  }>;
}

export const useRealTimeMarketplace = () => {
  const [isConnected, setIsConnected] = useState(false);

  const { data: marketplaceData, isLoading, refetch } = useQuery({
    queryKey: ['real-time-marketplace'],
    queryFn: async (): Promise<MarketplaceData> => {
      // Get total listings
      const { count: totalListings } = await supabase
        .from('coins')
        .select('*', { count: 'exact', head: true })
        .eq('authentication_status', 'verified');

      // Get active auctions
      const { count: activeAuctions } = await supabase
        .from('coins')
        .select('*', { count: 'exact', head: true })
        .eq('is_auction', true)
        .gt('auction_end', new Date().toISOString());

      // Get average price
      const { data: priceData } = await supabase
        .from('coins')
        .select('price')
        .eq('authentication_status', 'verified')
        .not('price', 'is', null);

      const avgPrice = priceData?.length 
        ? priceData.reduce((sum, coin) => sum + (coin.price || 0), 0) / priceData.length 
        : 0;

      // Get new listings in last 24h
      const { count: newListings24h } = await supabase
        .from('coins')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      // Get auctions ending soon (next 24 hours)
      const { count: endingSoon } = await supabase
        .from('coins')
        .select('*', { count: 'exact', head: true })
        .eq('is_auction', true)
        .lte('auction_end', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString())
        .gt('auction_end', new Date().toISOString());

      // Get top categories
      const { data: categoryData } = await supabase
        .from('coins')
        .select('category')
        .eq('authentication_status', 'verified');

      const categoryCounts = categoryData?.reduce((acc: Record<string, number>, coin) => {
        const category = coin.category || 'unclassified';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {}) || {};

      const topCategories = Object.entries(categoryCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Get recent activity with fixed query structure
      const [{ data: recentBids }, { data: recentTransactions }] = await Promise.all([
        supabase
          .from('bids')
          .select(`
            id,
            amount,
            created_at,
            coin_id
          `)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('payment_transactions')
          .select(`
            id,
            amount,
            created_at,
            coin_id
          `)
          .eq('status', 'completed')
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      // Get coin names separately to avoid relationship conflicts
      const bidCoinIds = recentBids?.map(bid => bid.coin_id).filter(Boolean) || [];
      const transactionCoinIds = recentTransactions?.map(tx => tx.coin_id).filter(Boolean) || [];
      const allCoinIds = [...bidCoinIds, ...transactionCoinIds];

      const { data: coinNames } = await supabase
        .from('coins')
        .select('id, name')
        .in('id', allCoinIds);

      const coinNameMap = coinNames?.reduce((acc: Record<string, string>, coin) => {
        acc[coin.id] = coin.name;
        return acc;
      }, {}) || {};

      const recentActivity = [
        ...(recentBids?.map(bid => ({
          id: bid.id,
          type: 'bid' as const,
          coinName: coinNameMap[bid.coin_id] || 'Unknown Coin',
          amount: bid.amount,
          timestamp: bid.created_at
        })) || []),
        ...(recentTransactions?.map(tx => ({
          id: tx.id,
          type: 'sale' as const,
          coinName: coinNameMap[tx.coin_id] || 'Unknown Coin',
          amount: tx.amount,
          timestamp: tx.created_at
        })) || [])
      ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

      return {
        totalListings: totalListings || 0,
        activeAuctions: activeAuctions || 0,
        avgPrice: Math.round(avgPrice),
        newListings24h: newListings24h || 0,
        endingSoon: endingSoon || 0,
        topCategories,
        recentActivity
      };
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('marketplace-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'coins'
        },
        () => {
          refetch();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bids'
        },
        () => {
          refetch();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_transactions'
        },
        () => {
          refetch();
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return {
    data: marketplaceData || {
      totalListings: 0,
      activeAuctions: 0,
      avgPrice: 0,
      newListings24h: 0,
      endingSoon: 0,
      topCategories: [],
      recentActivity: []
    },
    isLoading,
    isConnected,
    refetch
  };
};
