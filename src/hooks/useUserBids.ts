
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Bid {
  id: string;
  auction_id: string;
  bidder_id: string;
  amount: number;
  created_at: string;
  profiles?: {
    name: string;
  } | null;
}

export const useUserBids = (userId?: string) => {
  const [myBids, setMyBids] = useState<Bid[]>([]);

  useEffect(() => {
    const fetchUserBids = async () => {
      if (!userId) {
        setMyBids([]);
        return;
      }

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
          setMyBids([]);
        } else {
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
          setMyBids(validBids);
        }
      } catch (error) {
        console.error('Error fetching user bids:', error);
        setMyBids([]);
      }
    };

    fetchUserBids();
  }, [userId]);

  return { myBids };
};
