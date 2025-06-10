
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AuctionData {
  total_users: number;
  total_coins: number;
  total_transactions: number;
  errors_24h: number;
  active_alerts: number;
  health_status: string;
}

export const useAuctionDashboardData = () => {
  return useQuery({
    queryKey: ['admin-dashboard-comprehensive'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_admin_dashboard_comprehensive');
      if (error) throw error;
      return data as unknown as AuctionData;
    },
    refetchInterval: 30000,
  });
};

export const useAuctionStats = () => {
  return useQuery({
    queryKey: ['auction-stats'],
    queryFn: async () => {
      // Get active auctions count
      const { data: activeAuctions, error: auctionError } = await supabase
        .from('coins')
        .select('id')
        .eq('is_auction', true)
        .gt('auction_end', new Date().toISOString());
      
      if (auctionError) throw auctionError;

      // Get bids count for last 24h
      const { data: recentBids, error: bidError } = await supabase
        .from('auction_bids')
        .select('id, amount')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
      
      if (bidError) throw bidError;

      // Get unique bidders in last 7 days
      const { data: bidders, error: biddersError } = await supabase
        .from('auction_bids')
        .select('bidder_id')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
      
      if (biddersError) throw biddersError;

      const uniqueBidders = new Set(bidders?.map(b => b.bidder_id) || []).size;
      const avgBidAmount = recentBids?.length 
        ? recentBids.reduce((sum, bid) => sum + Number(bid.amount), 0) / recentBids.length 
        : 0;

      return {
        active: activeAuctions?.length || 0,
        bids_24h: recentBids?.length || 0,
        avg_bid_amount: avgBidAmount,
        active_bidders_7d: uniqueBidders,
        total_bids: bidders?.length || 0
      };
    },
  });
};

export const useActiveAuctions = () => {
  return useQuery({
    queryKey: ['active-auctions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coins')
        .select(`
          *,
          profiles!coins_user_id_fkey (name)
        `)
        .eq('is_auction', true)
        .gt('auction_end', new Date().toISOString())
        .order('auction_end', { ascending: true })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useRecentBids = () => {
  return useQuery({
    queryKey: ['recent-bids'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('auction_bids')
        .select(`
          *,
          coins!auction_bids_auction_id_fkey (name, year)
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching bids:', error);
        return [];
      }
      return data || [];
    },
  });
};

export const useBidderProfiles = (recentBids: any[] | undefined) => {
  return useQuery({
    queryKey: ['bidder-profiles', recentBids],
    queryFn: async () => {
      if (!recentBids?.length) return {};
      
      const bidderIds = [...new Set(recentBids.map(bid => bid.bidder_id))];
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', bidderIds);
      
      if (error) {
        console.error('Error fetching bidder profiles:', error);
        return {};
      }
      
      return (data || []).reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {} as Record<string, any>);
    },
    enabled: !!recentBids?.length,
  });
};
