
import { supabase } from '@/integrations/supabase/client';
import { Bid } from '@/types/auctionData';

export const useUserBidsFetch = () => {
  const fetchUserBids = async (userId: string): Promise<Bid[]> => {
    try {
      const { data: userBids, error: bidsError } = await supabase
        .from('auction_bids')
        .select(`
          *,
          profiles!bidder_id (name)
        `)
        .eq('bidder_id', userId)
        .order('created_at', { ascending: false });

      if (bidsError) {
        console.error('Error fetching user bids:', bidsError);
        return [];
      }

      const validBids: Bid[] = (userBids || []).filter((bid: any) => 
        bid && 
        bid.profiles && 
        typeof bid.profiles === 'object' && 
        !Array.isArray(bid.profiles) &&
        'name' in bid.profiles
      ).map((bid: any) => ({
        ...bid,
        profiles: {
          name: bid.profiles.name
        }
      }));

      return validBids;
    } catch (error) {
      console.error('Error fetching user bids:', error);
      return [];
    }
  };

  return { fetchUserBids };
};
