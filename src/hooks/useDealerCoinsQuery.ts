
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mockDealerCoins } from '@/data/mockDealerCoins';
import { mockAuctionCoins } from '@/data/mockAuctionCoins';

// Combine regular coins and auction coins
const allMockCoins = [...mockDealerCoins, ...mockAuctionCoins];

export const useDealerCoinsQuery = (dealerId?: string) => {
  return useQuery({
    queryKey: ['dealer-coins', dealerId],
    queryFn: async () => {
      // If dealerId provided, filter by dealer
      if (dealerId) {
        const dealerCoins = allMockCoins.filter(coin => coin.user_id === dealerId);
        return dealerCoins;
      }
      
      try {
        // Try to get from database first
        const { data, error } = await supabase
          .from('coins')
          .select(`
            *,
            profiles!coins_user_id_fkey (
              id,
              username,
              avatar_url,
              verified_dealer,
              full_name,
              created_at,
              rating,
              name
            )
          `)
          .order('created_at', { ascending: false });

        // If database has data AND no error, return it
        if (data && data.length > 0 && !error) {
          return data;
        }
      } catch (dbError) {
        console.log('Database not available, using mock data');
      }

      // Always return mock data if database is empty or unavailable
      return allMockCoins;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
