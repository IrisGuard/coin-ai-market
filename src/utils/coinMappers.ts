
import { Coin } from '@/types/coin';
import { getTimeLeft } from './timeUtils';

/**
 * Maps database coin records to the Coin interface structure
 */
export const mapDbCoinToCoin = (dbCoin: any): Coin => {
  return {
    ...dbCoin,
    isAuction: dbCoin.is_auction,
    timeLeft: dbCoin.auction_end ? getTimeLeft(new Date(dbCoin.auction_end)) : undefined,
  } as Coin;
};

/**
 * Maps a database coin with bids to the Coin interface
 */
export const mapDbCoinWithBidsToCoin = (dbCoin: any): Coin => {
  return {
    ...dbCoin,
    isAuction: dbCoin.is_auction,
    timeLeft: dbCoin.auction_end ? getTimeLeft(new Date(dbCoin.auction_end)) : undefined,
    bids: dbCoin.bids?.map((bid: any) => ({
      id: bid.id,
      amount: bid.amount,
      bidder: bid.user_id,
      bidderName: bid.user_name || undefined,
      time: bid.created_at
    }))
  } as Coin;
};

/**
 * Filter and sort static coin data (used as fallback)
 */
export const filterAndSortStaticData = (staticCoins: Coin[], options: {
  rarity?: string | null;
  isAuctionOnly?: boolean;
  searchTerm?: string;
  sortBy?: 'price' | 'year';
  sortDirection?: 'asc' | 'desc';
}): Coin[] => {
  const {
    rarity = null,
    isAuctionOnly = false,
    searchTerm = '',
    sortBy = 'price',
    sortDirection = 'desc'
  } = options;

  return staticCoins
    .filter(coin => {
      // Apply rarity filter
      if (rarity && coin.rarity !== rarity) {
        return false;
      }
      
      // Apply auction filter
      if (isAuctionOnly && !coin.isAuction) {
        return false;
      }
      
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return coin.name.toLowerCase().includes(searchLower) || 
              coin.year.toString().includes(searchLower) ||
              coin.grade.toLowerCase().includes(searchLower);
      }
      
      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortBy === 'price') {
        return sortDirection === 'asc' ? a.price - b.price : b.price - a.price;
      } else {
        return sortDirection === 'asc' ? a.year - b.year : b.year - a.year;
      }
    });
};
