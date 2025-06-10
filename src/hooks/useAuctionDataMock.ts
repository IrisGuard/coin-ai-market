import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAuctionData = (userId?: string) => {
  const { data: auctions, isLoading: auctionsLoading } = useQuery({
    queryKey: ['auctions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coins')
        .select('*')
        .eq('is_auction', true)
        .order('auction_end', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: myBids, isLoading: bidsLoading } = useQuery({
    queryKey: ['my-bids', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('bids')
        .select('*, coins(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId
  });

  return {
    auctions: auctions || [],
    myBids: myBids || [],
    isLoading: auctionsLoading || bidsLoading
  };
};

// Keep the old export for backward compatibility
export const useAuctionDataMock = useAuctionData;
