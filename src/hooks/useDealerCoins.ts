import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mockAuctionCoins } from '@/data/mockAuctionCoins';

// Mock data for regular dealer coins
const mockDealerCoins = [
  {
    id: '1',
    name: '1921 Morgan Silver Dollar',
    year: 1921,
    grade: 'MS-65',
    price: 450,
    rarity: 'Common',
    image: '/placeholder.svg',
    user_id: 'dealer-1',
    country: 'United States',
    denomination: 'Dollar',
    condition: 'Mint',
    description: 'Beautiful 1921 Morgan Silver Dollar in exceptional condition.',
    profiles: {
      id: 'dealer-1',
      name: 'Premium Coins USA',
      reputation: 98,
      verified_dealer: true,
      avatar_url: '/placeholder.svg'
    }
  },
  {
    id: '2',
    name: '1943 Walking Liberty Half Dollar',
    year: 1943,
    grade: 'AU-55',
    price: 85,
    rarity: 'Uncommon',
    image: '/placeholder.svg',
    user_id: 'dealer-2',
    country: 'United States',
    denomination: 'Half Dollar',
    condition: 'Near Mint',
    description: 'Classic Walking Liberty design in AU condition.',
    profiles: {
      id: 'dealer-2',
      name: 'Heritage Numismatics',
      reputation: 95,
      verified_dealer: true,
      avatar_url: '/placeholder.svg'
    }
  },
  {
    id: '3',
    name: '1916-D Mercury Dime',
    year: 1916,
    grade: 'VF-30',
    price: 1250,
    rarity: 'Rare',
    image: '/placeholder.svg',
    user_id: 'dealer-1',
    country: 'United States',
    denomination: 'Dime',
    condition: 'Good',
    description: 'Key date Mercury Dime in circulated condition.',
    profiles: {
      id: 'dealer-1',
      name: 'Premium Coins USA',
      reputation: 98,
      verified_dealer: true,
      avatar_url: '/placeholder.svg'
    }
  },
  {
    id: '4',
    name: '1936 Buffalo Nickel',
    year: 1936,
    grade: 'MS-62',
    price: 125,
    rarity: 'Common',
    image: '/placeholder.svg',
    user_id: 'dealer-3',
    country: 'United States',
    denomination: 'Nickel',
    condition: 'Mint',
    description: 'Classic Buffalo Nickel design in mint state.',
    profiles: {
      id: 'dealer-3',
      name: 'Rare Coin Experts',
      reputation: 92,
      verified_dealer: true,
      avatar_url: '/placeholder.svg'
    }
  },
  {
    id: '5',
    name: '1909-S VDB Lincoln Cent',
    year: 1909,
    grade: 'AU-50',
    price: 750,
    rarity: 'Rare',
    image: '/placeholder.svg',
    user_id: 'dealer-4',
    country: 'United States',
    denomination: 'Cent',
    condition: 'Excellent',
    description: 'First year Lincoln cent with designer initials.',
    profiles: {
      id: 'dealer-4',
      name: 'Error Coin Specialists',
      reputation: 96,
      verified_dealer: true,
      avatar_url: '/placeholder.svg'
    }
  },
  {
    id: '6',
    name: '1893-S Morgan Dollar',
    year: 1893,
    grade: 'XF-45',
    price: 3500,
    rarity: 'Ultra Rare',
    image: '/placeholder.svg',
    user_id: 'dealer-5',
    country: 'United States',
    denomination: 'Dollar',
    condition: 'Fair',
    description: 'Key date Morgan Dollar from San Francisco mint.',
    profiles: {
      id: 'dealer-5',
      name: 'Elite Coin Gallery',
      reputation: 99,
      verified_dealer: true,
      avatar_url: '/placeholder.svg'
    }
  },
  {
    id: '7',
    name: '1937-D Buffalo Nickel',
    year: 1937,
    grade: 'MS-64',
    price: 65,
    rarity: 'Uncommon',
    image: '/placeholder.svg',
    user_id: 'dealer-2',
    country: 'United States',
    denomination: 'Nickel',
    condition: 'Mint',
    description: 'Classic Buffalo Nickel design from Denver mint.',
    profiles: {
      id: 'dealer-2',
      name: 'Heritage Numismatics',
      reputation: 95,
      verified_dealer: true,
      avatar_url: '/placeholder.svg'
    }
  },
  {
    id: '8',
    name: '1955 Doubled Die Cent',
    year: 1955,
    grade: 'AU-58',
    price: 1800,
    rarity: 'Rare',
    image: '/placeholder.svg',
    user_id: 'dealer-4',
    country: 'United States',
    denomination: 'Cent',
    condition: 'Excellent',
    description: 'Famous doubled die error coin.',
    profiles: {
      id: 'dealer-4',
      name: 'Error Coin Specialists',
      reputation: 96,
      verified_dealer: true,
      avatar_url: '/placeholder.svg'
    }
  },
  {
    id: '9',
    name: '1932-D Washington Quarter',
    year: 1932,
    grade: 'VF-20',
    price: 120,
    rarity: 'Rare',
    image: '/placeholder.svg',
    user_id: 'dealer-3',
    country: 'United States',
    denomination: 'Quarter',
    condition: 'Good',
    description: 'Key date Washington quarter from Denver mint.',
    profiles: {
      id: 'dealer-3',
      name: 'Rare Coin Experts',
      reputation: 92,
      verified_dealer: true,
      avatar_url: '/placeholder.svg'
    }
  },
  {
    id: '10',
    name: '1921 Peace Silver Dollar',
    year: 1921,
    grade: 'MS-63',
    price: 35,
    rarity: 'Common',
    image: '/placeholder.svg',
    user_id: 'dealer-1',
    country: 'United States',
    denomination: 'Dollar',
    condition: 'Mint',
    description: 'First year Peace Silver Dollar in mint state.',
    profiles: {
      id: 'dealer-1',
      name: 'Premium Coins USA',
      reputation: 98,
      verified_dealer: true,
      avatar_url: '/placeholder.svg'
    }
  }
];

// Combine regular coins and auction coins
const allMockCoins = [...mockDealerCoins, ...mockAuctionCoins];

export const useDealerCoins = (dealerId?: string) => {
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

export const useAllDealerCoins = () => {
  return useDealerCoins();
};
