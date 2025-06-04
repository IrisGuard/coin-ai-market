
import { Coin } from '@/types/coin';

export const sampleCoins: Coin[] = [
  {
    id: '1',
    name: '1909-S VDB Lincoln Wheat Cent',
    year: 1909,
    grade: 'MS-65',
    price: 1250.00,
    rarity: 'Ultra Rare',
    image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=400&h=400&fit=crop',
    user_id: 'user1',
    country: 'United States',
    denomination: '1 Cent',
    condition: 'Mint',
    composition: 'Bronze',
    diameter: 19.05,
    weight: 3.11,
    mint: 'San Francisco',
    mintage: 484000,
    description: 'The 1909-S VDB Lincoln cent is one of the most sought-after coins in American numismatics. This is the first year of Lincoln cent production.',
    views: 156,
    favorites: 23,
    featured: true,
    authentication_status: 'verified',
    is_auction: true,
    auction_end: '2024-12-31T23:59:59Z',
    reserve_price: 1000.00,
    created_at: '2024-01-15T10:00:00Z',
    profiles: {
      id: 'user1',
      name: 'John Collector',
      reputation: 95,
      verified_dealer: true
    }
  },
  {
    id: '2',
    name: '1921 Morgan Silver Dollar',
    year: 1921,
    grade: 'AU-58',
    price: 45.00,
    rarity: 'Common',
    image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=400&h=400&fit=crop',
    user_id: 'user2',
    country: 'United States',
    denomination: '1 Dollar',
    condition: 'Near Mint',
    composition: '90% Silver',
    diameter: 38.1,
    weight: 26.73,
    mint: 'Philadelphia',
    mintage: 44690000,
    description: 'A classic Morgan Silver Dollar from 1921, the last year of regular production before the Peace Dollar.',
    views: 89,
    favorites: 12,
    featured: false,
    authentication_status: 'verified',
    is_auction: false,
    created_at: '2024-01-20T14:30:00Z',
    profiles: {
      id: 'user2',
      name: 'Sarah Smith',
      reputation: 88,
      verified_dealer: false
    }
  },
  {
    id: '3',
    name: '1943 Steel Wheat Penny',
    year: 1943,
    grade: 'MS-64',
    price: 0.75,
    rarity: 'Common',
    image: 'https://images.unsplash.com/photo-1567427018141-95ea71917775?w=400&h=400&fit=crop',
    user_id: 'user3',
    country: 'United States',
    denomination: '1 Cent',
    condition: 'Mint',
    composition: 'Steel',
    diameter: 19.05,
    weight: 2.7,
    mint: 'Philadelphia',
    mintage: 684628670,
    description: 'Steel penny produced during WWII due to copper shortage. An interesting piece of wartime history.',
    views: 45,
    favorites: 8,
    featured: false,
    authentication_status: 'verified',
    is_auction: false,
    created_at: '2024-01-25T09:15:00Z',
    profiles: {
      id: 'user3',
      name: 'Mike Johnson',
      reputation: 76,
      verified_dealer: false
    }
  },
  {
    id: '4',
    name: '1955 Double Die Lincoln Cent',
    year: 1955,
    grade: 'AU-50',
    price: 1800.00,
    rarity: 'Ultra Rare',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=400&fit=crop',
    user_id: 'user4',
    country: 'United States',
    denomination: '1 Cent',
    condition: 'Excellent',
    composition: 'Bronze',
    diameter: 19.05,
    weight: 3.11,
    mint: 'Philadelphia',
    mintage: 20000,
    description: 'Famous error coin with visible doubling on the obverse. One of the most recognizable error coins.',
    views: 203,
    favorites: 34,
    featured: true,
    authentication_status: 'verified',
    is_auction: true,
    auction_end: '2024-12-28T18:00:00Z',
    reserve_price: 1500.00,
    created_at: '2024-01-10T16:45:00Z',
    profiles: {
      id: 'user4',
      name: 'Expert Coins LLC',
      reputation: 99,
      verified_dealer: true
    }
  },
  {
    id: '5',
    name: '1964 Kennedy Half Dollar',
    year: 1964,
    grade: 'MS-66',
    price: 25.00,
    rarity: 'Uncommon',
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=400&fit=crop',
    user_id: 'user5',
    country: 'United States',
    denomination: '50 Cents',
    condition: 'Mint',
    composition: '90% Silver',
    diameter: 30.6,
    weight: 12.5,
    mint: 'Philadelphia',
    mintage: 273304004,
    description: 'First year Kennedy Half Dollar with 90% silver content. Commemorates President John F. Kennedy.',
    views: 67,
    favorites: 15,
    featured: false,
    authentication_status: 'verified',
    is_auction: false,
    created_at: '2024-01-18T11:20:00Z',
    profiles: {
      id: 'user5',
      name: 'Lisa Williams',
      reputation: 82,
      verified_dealer: false
    }
  },
  {
    id: '6',
    name: '1932-D Washington Quarter',
    year: 1932,
    grade: 'F-15',
    price: 150.00,
    rarity: 'Rare',
    image: 'https://images.unsplash.com/photo-1620428268482-cf1851a36764?w=400&h=400&fit=crop',
    user_id: 'user6',
    country: 'United States',
    denomination: '25 Cents',
    condition: 'Good',
    composition: '90% Silver',
    diameter: 24.3,
    weight: 6.25,
    mint: 'Denver',
    mintage: 436800,
    description: 'Key date Washington Quarter from Denver mint. First year of Washington Quarter series.',
    views: 92,
    favorites: 18,
    featured: false,
    authentication_status: 'verified',
    is_auction: true,
    auction_end: '2024-12-30T20:30:00Z',
    reserve_price: 120.00,
    created_at: '2024-01-22T13:10:00Z',
    profiles: {
      id: 'user6',
      name: 'Denver Coin Shop',
      reputation: 91,
      verified_dealer: true
    }
  }
];

export const getRandomCoins = (count: number): Coin[] => {
  const shuffled = [...sampleCoins].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getCoinById = (id: string): Coin | undefined => {
  return sampleCoins.find(coin => coin.id === id);
};

export const getFeaturedCoins = (): Coin[] => {
  return sampleCoins.filter(coin => coin.featured);
};

export const getAuctionCoins = (): Coin[] => {
  return sampleCoins.filter(coin => coin.is_auction);
};
