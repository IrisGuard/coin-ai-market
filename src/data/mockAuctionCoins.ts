
import { AuctionCoin } from '@/types/auction';
import { featuredAuctions } from './featuredAuctions';
import { generateAuctionCoins } from '@/utils/auctionGenerator';

// Combine featured auctions with generated ones to reach 50 total
const generatedAuctions = generateAuctionCoins(46, 5);

export const mockAuctionCoins: AuctionCoin[] = [
  ...featuredAuctions,
  ...generatedAuctions
];
