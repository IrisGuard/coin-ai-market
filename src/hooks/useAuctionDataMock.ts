
import { useState, useEffect } from 'react';

interface AuctionCoin {
  id: string;
  name: string;
  year: number;
  image: string;
  starting_price: number;
  current_bid: number;
  reserve_price: number;
  auction_end: string;
  bid_count: number;
  rarity: string;
  condition: string;
  country: string;
  seller_id: string;
  highest_bidder_id: string | null;
  description: string;
  views: number;
  watchers: number;
  profiles?: {
    name: string;
    reputation: number;
    verified_dealer: boolean;
  } | null;
}

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

const mockAuctions: AuctionCoin[] = [
  {
    id: 'auction-1',
    name: '1921 Morgan Silver Dollar',
    year: 1921,
    image: '/placeholder.svg',
    starting_price: 300,
    current_bid: 450,
    reserve_price: 400,
    auction_end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    bid_count: 12,
    rarity: 'Uncommon',
    condition: 'Mint',
    country: 'USA',
    seller_id: '1',
    highest_bidder_id: 'user-123',
    description: 'Beautiful Morgan dollar with excellent luster',
    views: 234,
    watchers: 18,
    profiles: {
      name: 'Professional Coin Gallery',
      reputation: 98,
      verified_dealer: true
    }
  },
  {
    id: 'auction-2',
    name: '1916-D Mercury Dime',
    year: 1916,
    image: '/placeholder.svg',
    starting_price: 800,
    current_bid: 1250,
    reserve_price: 1000,
    auction_end: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5 hours from now
    bid_count: 28,
    rarity: 'Rare',
    condition: 'Good',
    country: 'USA',
    seller_id: '2',
    highest_bidder_id: 'user-456',
    description: 'Key date Mercury dime in very fine condition',
    views: 567,
    watchers: 35,
    profiles: {
      name: 'European Coin Specialists',
      reputation: 95,
      verified_dealer: true
    }
  },
  {
    id: 'auction-3',
    name: '1909-S VDB Lincoln Cent',
    year: 1909,
    image: '/placeholder.svg',
    starting_price: 500,
    current_bid: 750,
    reserve_price: 650,
    auction_end: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    bid_count: 15,
    rarity: 'Rare',
    condition: 'Good',
    country: 'USA',
    seller_id: '3',
    highest_bidder_id: 'user-789',
    description: 'First year Lincoln cent with VDB initials',
    views: 432,
    watchers: 22,
    profiles: {
      name: 'Ancient Treasures Ltd.',
      reputation: 92,
      verified_dealer: true
    }
  },
  {
    id: 'auction-4',
    name: '1924 Saint-Gaudens Double Eagle',
    year: 1924,
    image: '/placeholder.svg',
    starting_price: 2000,
    current_bid: 2850,
    reserve_price: 2500,
    auction_end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    bid_count: 8,
    rarity: 'Rare',
    condition: 'Near Mint',
    country: 'USA',
    seller_id: '4',
    highest_bidder_id: 'user-321',
    description: 'Beautiful Saint-Gaudens design in gold',
    views: 1234,
    watchers: 45,
    profiles: {
      name: 'Gold Standard Numismatics',
      reputation: 99,
      verified_dealer: true
    }
  },
  {
    id: 'auction-5',
    name: '1955 Doubled Die Lincoln Cent',
    year: 1955,
    image: '/placeholder.svg',
    starting_price: 1200,
    current_bid: 1800,
    reserve_price: 1500,
    auction_end: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours from now
    bid_count: 21,
    rarity: 'Very Rare',
    condition: 'Good',
    country: 'USA',
    seller_id: '5',
    highest_bidder_id: 'user-654',
    description: 'Famous doubled die error coin',
    views: 987,
    watchers: 38,
    profiles: {
      name: 'The Coin Vault',
      reputation: 96,
      verified_dealer: true
    }
  },
  {
    id: 'auction-6',
    name: '1936 Australian Florin',
    year: 1936,
    image: '/placeholder.svg',
    starting_price: 80,
    current_bid: 125,
    reserve_price: 100,
    auction_end: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days from now
    bid_count: 7,
    rarity: 'Uncommon',
    condition: 'Excellent',
    country: 'Australia',
    seller_id: '6',
    highest_bidder_id: 'user-987',
    description: 'Centennial florin with coat of arms',
    views: 156,
    watchers: 12,
    profiles: {
      name: 'World Coin Exchange',
      reputation: 89,
      verified_dealer: true
    }
  }
];

const mockMyBids: Bid[] = [
  {
    id: 'bid-1',
    auction_id: 'auction-1',
    bidder_id: 'current-user',
    amount: 420,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    profiles: {
      name: 'Current User'
    }
  },
  {
    id: 'bid-2',
    auction_id: 'auction-3',
    bidder_id: 'current-user',
    amount: 700,
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    profiles: {
      name: 'Current User'
    }
  }
];

export const useAuctionDataMock = (userId?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [auctions, setAuctions] = useState<AuctionCoin[]>([]);
  const [myBids, setMyBids] = useState<Bid[]>([]);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setAuctions(mockAuctions);
      if (userId) {
        setMyBids(mockMyBids);
      }
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [userId]);

  return { auctions, myBids, isLoading };
};
