import { AuctionCoin, AuctionRarity, CoinType, Dealer } from '@/types/auction';
import { coinTypes } from '@/data/coinTypes';
import { dealers } from '@/data/dealers';

export const generateAuctionCoin = (id: number): AuctionCoin => {
  const randomType = coinTypes[Math.floor(Math.random() * coinTypes.length)];
  const randomYear = 1900 + Math.floor(Math.random() * 120);
  const randomGrade = ['MS-60', 'MS-63', 'MS-65', 'AU-55', 'VF-30', 'EF-40'][Math.floor(Math.random() * 6)];
  
  const rarityOptions: AuctionRarity[] = ['Common', 'Uncommon', 'Rare', 'Ultra Rare'];
  const randomRarity = rarityOptions[Math.floor(Math.random() * 4)];
  
  const multiplier = randomRarity === 'Ultra Rare' ? 10 : randomRarity === 'Rare' ? 5 : randomRarity === 'Uncommon' ? 2 : 1;
  const startingPrice = randomType.basePrice * multiplier;
  const currentBid = startingPrice + Math.floor(Math.random() * startingPrice * 0.5);
  const reservePrice = currentBid + Math.floor(Math.random() * 50);
  
  // Random auction end times from 1 hour to 7 days
  const hoursFromNow = Math.floor(Math.random() * (7 * 24)) + 1;
  const auctionEnd = new Date(Date.now() + hoursFromNow * 60 * 60 * 1000).toISOString();
  
  const bidCount = Math.floor(Math.random() * 25) + 1;
  const watchers = Math.floor(Math.random() * 50) + 5;
  const views = Math.floor(Math.random() * 200) + 20;
  
  const randomDealer = dealers[Math.floor(Math.random() * dealers.length)];
  
  return {
    id: `auction-${id}`,
    name: `${randomYear} ${randomType.name}`,
    year: randomYear,
    grade: randomGrade,
    rarity: randomRarity,
    image: '/placeholder.svg',
    country: 'United States',
    denomination: randomType.denom,
    condition: 'Excellent',
    description: `Beautiful ${randomYear} ${randomType.name} in ${randomGrade} condition.`,
    price: startingPrice,
    user_id: randomDealer.id,
    starting_bid: startingPrice,
    current_bid: currentBid,
    reserve_price: reservePrice,
    auction_end: auctionEnd,
    bid_count: bidCount,
    seller_id: randomDealer.id,
    highest_bidder_id: `user-${(id % 10) + 1}`,
    watchers: watchers,
    views: views,
    is_auction: true,
    authentication_status: 'verified',
    featured: Math.random() > 0.8,
    profiles: {
      id: randomDealer.id,
      name: randomDealer.name,
      reputation: randomDealer.rep,
      verified_dealer: true,
      avatar_url: '/placeholder.svg'
    }
  };
};

export const generateAuctionCoins = (count: number, startId: number = 5): AuctionCoin[] => {
  const coins: AuctionCoin[] = [];
  for (let i = startId; i <= startId + count - 1; i++) {
    coins.push(generateAuctionCoin(i));
  }
  return coins;
};
