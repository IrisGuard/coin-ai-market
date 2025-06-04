
import { Coin } from '@/types/coin';

interface DbCoin {
  id: string;
  name: string;
  year: number;
  grade: string;
  price: number;
  rarity: string;
  image: string;
  description?: string;
  condition?: string;
  country?: string;
  composition?: string;
  diameter?: number;
  weight?: number;
  user_id?: string;
  is_auction?: boolean;
  auction_end?: string;
  obverse_image?: string;
  reverse_image?: string;
  views?: number;
  created_at?: string;
}

interface DbCoinWithBids extends DbCoin {
  bids?: Array<{
    id: string;
    amount: number;
    user_id: string;
    created_at: string;
  }>;
}

export const mapDbCoinToCoin = (dbCoin: DbCoin): Coin => {
  return {
    id: dbCoin.id,
    name: dbCoin.name,
    year: dbCoin.year,
    grade: dbCoin.grade,
    price: dbCoin.price,
    rarity: dbCoin.rarity as 'Common' | 'Uncommon' | 'Rare' | 'Ultra Rare',
    image: dbCoin.image || dbCoin.obverse_image || '',
    description: dbCoin.description,
    condition: dbCoin.condition as any,
    country: dbCoin.country,
    composition: dbCoin.composition,
    diameter: dbCoin.diameter,
    weight: dbCoin.weight,
    isAuction: dbCoin.is_auction || false,
    timeLeft: dbCoin.auction_end ? calculateTimeLeft(dbCoin.auction_end) : undefined,
    views: dbCoin.views || 0,
  };
};

export const mapDbCoinWithBidsToCoin = (dbCoin: DbCoinWithBids): Coin => {
  const baseCoin = mapDbCoinToCoin(dbCoin);
  
  if (dbCoin.bids && dbCoin.bids.length > 0) {
    const highestBid = Math.max(...dbCoin.bids.map(bid => bid.amount));
    baseCoin.price = Math.max(baseCoin.price, highestBid);
  }
  
  return baseCoin;
};

const calculateTimeLeft = (auctionEnd: string): string => {
  const endTime = new Date(auctionEnd);
  const now = new Date();
  const timeDiff = endTime.getTime() - now.getTime();
  
  if (timeDiff <= 0) {
    return 'Ended';
  }
  
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};
