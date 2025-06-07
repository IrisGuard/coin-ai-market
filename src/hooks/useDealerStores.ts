
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DealerProfile {
  id: string;
  username?: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  rating?: number;
  location?: string;
  verified_dealer?: boolean;
}

const mockDealers: DealerProfile[] = [
  {
    id: '1',
    username: 'CoinMaster_Pro',
    full_name: 'Professional Coin Gallery',
    bio: 'Specializing in rare American coins and historical pieces. Over 20 years of experience in numismatics.',
    avatar_url: '/placeholder.svg',
    rating: 4.8,
    location: 'New York, NY',
    verified_dealer: true
  },
  {
    id: '2',
    username: 'EuropeCoins',
    full_name: 'European Coin Specialists',
    bio: 'Expert in European currency and medieval coins. Certified by major grading services.',
    avatar_url: '/placeholder.svg',
    rating: 4.9,
    location: 'London, UK',
    verified_dealer: true
  },
  {
    id: '3',
    username: 'AncientTreasures',
    full_name: 'Ancient Treasures Ltd.',
    bio: 'Authentic ancient Roman and Greek coins. Museum-quality pieces with full provenance.',
    avatar_url: '/placeholder.svg',
    rating: 4.7,
    location: 'Athens, Greece',
    verified_dealer: true
  },
  {
    id: '4',
    username: 'ModernMints',
    full_name: 'Modern Mint Collection',
    bio: 'Contemporary coins and limited editions. Official distributor for major world mints.',
    avatar_url: '/placeholder.svg',
    rating: 4.6,
    location: 'Toronto, Canada',
    verified_dealer: true
  },
  {
    id: '5',
    username: 'GoldStandard',
    full_name: 'Gold Standard Numismatics',
    bio: 'Premium gold and silver coins. Investment-grade precious metal coins and bullion.',
    avatar_url: '/placeholder.svg',
    rating: 4.9,
    location: 'Zurich, Switzerland',
    verified_dealer: true
  },
  {
    id: '6',
    username: 'CoinVault',
    full_name: 'The Coin Vault',
    bio: 'Family-owned business since 1952. Specializing in American heritage coins and collections.',
    avatar_url: '/placeholder.svg',
    rating: 4.8,
    location: 'San Francisco, CA',
    verified_dealer: true
  },
  {
    id: '7',
    username: 'WorldCoins',
    full_name: 'World Coin Exchange',
    bio: 'Global marketplace for international coins. Covering all continents and time periods.',
    avatar_url: '/placeholder.svg',
    rating: 4.5,
    location: 'Melbourne, Australia',
    verified_dealer: true
  },
  {
    id: '8',
    username: 'RareFinds',
    full_name: 'Rare Finds Numismatics',
    bio: 'Hunting down the rarest coins for serious collectors. Specialized authentication services.',
    avatar_url: '/placeholder.svg',
    rating: 4.7,
    location: 'Berlin, Germany',
    verified_dealer: true
  },
  {
    id: '9',
    username: 'CoinConnect',
    full_name: 'Coin Connect Gallery',
    bio: 'Connecting collectors with authenticated pieces. Modern online marketplace with traditional values.',
    avatar_url: '/placeholder.svg',
    rating: 4.6,
    location: 'Tokyo, Japan',
    verified_dealer: true
  },
  {
    id: '10',
    username: 'HeritageCoins',
    full_name: 'Heritage Coin Company',
    bio: 'Preserving numismatic heritage through exceptional coins. Auction house with retail storefront.',
    avatar_url: '/placeholder.svg',
    rating: 4.8,
    location: 'Paris, France',
    verified_dealer: true
  }
];

export const useDealerStores = () => {
  return useQuery({
    queryKey: ['dealer-stores'],
    queryFn: async () => {
      // Try to fetch real dealers from the database
      const { data: realDealers, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, bio, avatar_url, rating, location, verified_dealer')
        .eq('verified_dealer', true)
        .limit(20);

      if (error) {
        console.log('Error fetching dealers, using mock data:', error);
        return mockDealers;
      }

      // If we have real dealers, use them, otherwise use mock data
      if (realDealers && realDealers.length > 0) {
        return realDealers as DealerProfile[];
      }

      return mockDealers;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
