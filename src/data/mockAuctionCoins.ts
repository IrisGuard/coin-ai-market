
export const mockAuctionCoins = [
  {
    id: 'auction-1',
    name: '1916-D Mercury Dime',
    year: 1916,
    grade: 'MS-65',
    rarity: 'Ultra Rare' as const,
    image: '/placeholder.svg',
    country: 'United States',
    denomination: 'Dime',
    condition: 'Mint',
    description: 'Extremely rare 1916-D Mercury Dime in exceptional condition.',
    price: 1200,
    user_id: 'dealer-1',
    starting_price: 1200,
    current_bid: 1850,
    reserve_price: 2000,
    auction_end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    bid_count: 12,
    seller_id: 'dealer-1',
    highest_bidder_id: 'user-3',
    watchers: 24,
    views: 156,
    is_auction: true,
    authentication_status: 'verified' as const,
    featured: true,
    profiles: {
      id: 'dealer-1',
      name: 'Premium Coins USA',
      reputation: 98,
      verified_dealer: true,
      avatar_url: '/placeholder.svg'
    }
  },
  {
    id: 'auction-2',
    name: '1893-S Morgan Silver Dollar',
    year: 1893,
    grade: 'AU-55',
    rarity: 'Ultra Rare' as const,
    image: '/placeholder.svg',
    country: 'United States',
    denomination: 'Dollar',
    condition: 'Near Mint',
    description: 'Key date Morgan Dollar from San Francisco mint.',
    price: 3200,
    user_id: 'dealer-2',
    starting_price: 3200,
    current_bid: 4750,
    reserve_price: 5000,
    auction_end: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    bid_count: 18,
    seller_id: 'dealer-2',
    highest_bidder_id: 'user-5',
    watchers: 31,
    views: 203,
    is_auction: true,
    authentication_status: 'verified' as const,
    featured: true,
    profiles: {
      id: 'dealer-2',
      name: 'Heritage Numismatics',
      reputation: 95,
      verified_dealer: true,
      avatar_url: '/placeholder.svg'
    }
  },
  {
    id: 'auction-3',
    name: '1909-S VDB Lincoln Cent',
    year: 1909,
    grade: 'MS-63',
    rarity: 'Rare' as const,
    image: '/placeholder.svg',
    country: 'United States',
    denomination: 'Cent',
    condition: 'Mint',
    description: 'First year Lincoln cent with designer initials.',
    price: 650,
    user_id: 'dealer-3',
    starting_price: 650,
    current_bid: 925,
    reserve_price: 1000,
    auction_end: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    bid_count: 8,
    seller_id: 'dealer-3',
    highest_bidder_id: 'user-2',
    watchers: 19,
    views: 89,
    is_auction: true,
    authentication_status: 'verified' as const,
    featured: false,
    profiles: {
      id: 'dealer-3',
      name: 'Rare Coin Experts',
      reputation: 92,
      verified_dealer: true,
      avatar_url: '/placeholder.svg'
    }
  },
  {
    id: 'auction-4',
    name: '1943 Steel Cent',
    year: 1943,
    grade: 'MS-64',
    rarity: 'Uncommon' as const,
    image: '/placeholder.svg',
    country: 'United States',
    denomination: 'Cent',
    condition: 'Mint',
    description: 'Wartime steel penny in brilliant uncirculated condition.',
    price: 25,
    user_id: 'dealer-1',
    starting_price: 25,
    current_bid: 45,
    reserve_price: 50,
    auction_end: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    bid_count: 5,
    seller_id: 'dealer-1',
    highest_bidder_id: 'user-4',
    watchers: 7,
    views: 34,
    is_auction: true,
    authentication_status: 'verified' as const,
    featured: false,
    profiles: {
      id: 'dealer-1',
      name: 'Premium Coins USA',
      reputation: 98,
      verified_dealer: true,
      avatar_url: '/placeholder.svg'
    }
  }
];

// Add 46 more coins to reach 50 total
for (let i = 5; i <= 50; i++) {
  const coinTypes = [
    { name: 'Morgan Silver Dollar', denom: 'Dollar', basePrice: 45 },
    { name: 'Peace Silver Dollar', denom: 'Dollar', basePrice: 35 },
    { name: 'Mercury Dime', denom: 'Dime', basePrice: 15 },
    { name: 'Washington Quarter', denom: 'Quarter', basePrice: 8 },
    { name: 'Lincoln Cent', denom: 'Cent', basePrice: 5 },
    { name: 'Buffalo Nickel', denom: 'Nickel', basePrice: 12 },
    { name: 'Walking Liberty Half', denom: 'Half Dollar', basePrice: 25 }
  ];
  
  const randomType = coinTypes[Math.floor(Math.random() * coinTypes.length)];
  const randomYear = 1900 + Math.floor(Math.random() * 120);
  const randomGrade = ['MS-60', 'MS-63', 'MS-65', 'AU-55', 'VF-30', 'EF-40'][Math.floor(Math.random() * 6)];
  const randomRarity = ['Common', 'Uncommon', 'Rare', 'Ultra Rare'][Math.floor(Math.random() * 4)] as const;
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
  
  const dealers = [
    { id: 'dealer-1', name: 'Premium Coins USA', rep: 98 },
    { id: 'dealer-2', name: 'Heritage Numismatics', rep: 95 },
    { id: 'dealer-3', name: 'Rare Coin Experts', rep: 92 },
    { id: 'dealer-4', name: 'Error Coin Specialists', rep: 96 },
    { id: 'dealer-5', name: 'Elite Coin Gallery', rep: 99 }
  ];
  const randomDealer = dealers[Math.floor(Math.random() * dealers.length)];
  
  mockAuctionCoins.push({
    id: `auction-${i}`,
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
    starting_price: startingPrice,
    current_bid: currentBid,
    reserve_price: reservePrice,
    auction_end: auctionEnd,
    bid_count: bidCount,
    seller_id: randomDealer.id,
    highest_bidder_id: `user-${(i % 10) + 1}`,
    watchers: watchers,
    views: views,
    is_auction: true,
    authentication_status: 'verified' as const,
    featured: Math.random() > 0.8,
    profiles: {
      id: randomDealer.id,
      name: randomDealer.name,
      reputation: randomDealer.rep,
      verified_dealer: true,
      avatar_url: '/placeholder.svg'
    }
  });
}
