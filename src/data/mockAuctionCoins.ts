
export const mockAuctionCoins = [
  {
    id: 'auction-1',
    name: '1916-D Mercury Dime',
    year: 1916,
    grade: 'MS-65',
    rarity: 'Ultra Rare',
    image: '/placeholder.svg',
    country: 'United States',
    denomination: 'Dime',
    condition: 'Mint',
    description: 'Extremely rare 1916-D Mercury Dime in exceptional condition.',
    starting_price: 1200,
    current_bid: 1850,
    reserve_price: 2000,
    auction_end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days
    bid_count: 12,
    seller_id: 'dealer-1',
    highest_bidder_id: 'user-3',
    watchers: 24,
    is_auction: true,
    profiles: {
      name: 'Premium Coins USA',
      reputation: 98,
      verified_dealer: true
    }
  },
  {
    id: 'auction-2',
    name: '1893-S Morgan Silver Dollar',
    year: 1893,
    grade: 'AU-55',
    rarity: 'Ultra Rare',
    image: '/placeholder.svg',
    country: 'United States',
    denomination: 'Dollar',
    condition: 'Near Mint',
    description: 'Key date Morgan Dollar from San Francisco mint.',
    starting_price: 3200,
    current_bid: 4750,
    reserve_price: 5000,
    auction_end: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours
    bid_count: 18,
    seller_id: 'dealer-2',
    highest_bidder_id: 'user-5',
    watchers: 31,
    is_auction: true,
    profiles: {
      name: 'Heritage Numismatics',
      reputation: 95,
      verified_dealer: true
    }
  },
  {
    id: 'auction-3',
    name: '1909-S VDB Lincoln Cent',
    year: 1909,
    grade: 'MS-63',
    rarity: 'Rare',
    image: '/placeholder.svg',
    country: 'United States',
    denomination: 'Cent',
    condition: 'Mint',
    description: 'First year Lincoln cent with designer initials.',
    starting_price: 650,
    current_bid: 925,
    reserve_price: 1000,
    auction_end: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day
    bid_count: 8,
    seller_id: 'dealer-3',
    highest_bidder_id: 'user-2',
    watchers: 19,
    is_auction: true,
    profiles: {
      name: 'Rare Coin Experts',
      reputation: 92,
      verified_dealer: true
    }
  },
  {
    id: 'auction-4',
    name: '1943 Steel Cent',
    year: 1943,
    grade: 'MS-64',
    rarity: 'Uncommon',
    image: '/placeholder.svg',
    country: 'United States',
    denomination: 'Cent',
    condition: 'Mint',
    description: 'Wartime steel penny in brilliant uncirculated condition.',
    starting_price: 25,
    current_bid: 45,
    reserve_price: 50,
    auction_end: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours
    bid_count: 5,
    seller_id: 'dealer-1',
    highest_bidder_id: 'user-4',
    watchers: 7,
    is_auction: true,
    profiles: {
      name: 'Premium Coins USA',
      reputation: 98,
      verified_dealer: true
    }
  },
  {
    id: 'auction-5',
    name: '1955 Doubled Die Lincoln Cent',
    year: 1955,
    grade: 'AU-50',
    rarity: 'Ultra Rare',
    image: '/placeholder.svg',
    country: 'United States',
    denomination: 'Cent',
    condition: 'Excellent',
    description: 'Famous doubled die error coin.',
    starting_price: 1500,
    current_bid: 2100,
    reserve_price: 2200,
    auction_end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
    bid_count: 14,
    seller_id: 'dealer-4',
    highest_bidder_id: 'user-1',
    watchers: 28,
    is_auction: true,
    profiles: {
      name: 'Error Coin Specialists',
      reputation: 96,
      verified_dealer: true
    }
  },
  {
    id: 'auction-6',
    name: '1921 Walking Liberty Half Dollar',
    year: 1921,
    grade: 'MS-62',
    rarity: 'Rare',
    image: '/placeholder.svg',
    country: 'United States',
    denomination: 'Half Dollar',
    condition: 'Mint',
    description: 'Key date Walking Liberty half in mint state.',
    starting_price: 180,
    current_bid: 285,
    reserve_price: 300,
    auction_end: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days
    bid_count: 9,
    seller_id: 'dealer-2',
    highest_bidder_id: 'user-6',
    watchers: 15,
    is_auction: true,
    profiles: {
      name: 'Heritage Numismatics',
      reputation: 95,
      verified_dealer: true
    }
  },
  {
    id: 'auction-7',
    name: '1916 Standing Liberty Quarter',
    year: 1916,
    grade: 'VF-30',
    rarity: 'Ultra Rare',
    image: '/placeholder.svg',
    country: 'United States',
    denomination: 'Quarter',
    condition: 'Good',
    description: 'First year of issue Standing Liberty quarter.',
    starting_price: 8500,
    current_bid: 12500,
    reserve_price: 13000,
    auction_end: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
    bid_count: 22,
    seller_id: 'dealer-5',
    highest_bidder_id: 'user-7',
    watchers: 45,
    is_auction: true,
    profiles: {
      name: 'Elite Coin Gallery',
      reputation: 99,
      verified_dealer: true
    }
  },
  {
    id: 'auction-8',
    name: '1932-D Washington Quarter',
    year: 1932,
    grade: 'MS-60',
    rarity: 'Rare',
    image: '/placeholder.svg',
    country: 'United States',
    denomination: 'Quarter',
    condition: 'Mint',
    description: 'Key date Washington quarter from Denver mint.',
    starting_price: 120,
    current_bid: 185,
    reserve_price: 200,
    auction_end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days
    bid_count: 11,
    seller_id: 'dealer-3',
    highest_bidder_id: 'user-8',
    watchers: 16,
    is_auction: true,
    profiles: {
      name: 'Rare Coin Experts',
      reputation: 92,
      verified_dealer: true
    }
  },
  {
    id: 'auction-9',
    name: '1937-D Three-Legged Buffalo Nickel',
    year: 1937,
    grade: 'VF-20',
    rarity: 'Ultra Rare',
    image: '/placeholder.svg',
    country: 'United States',
    denomination: 'Nickel',
    condition: 'Good',
    description: 'Famous error coin missing front leg on buffalo.',
    starting_price: 450,
    current_bid: 675,
    reserve_price: 700,
    auction_end: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours
    bid_count: 13,
    seller_id: 'dealer-4',
    highest_bidder_id: 'user-9',
    watchers: 21,
    is_auction: true,
    profiles: {
      name: 'Error Coin Specialists',
      reputation: 96,
      verified_dealer: true
    }
  },
  {
    id: 'auction-10',
    name: '1970-S Small Date Lincoln Cent',
    year: 1970,
    grade: 'MS-65',
    rarity: 'Ultra Rare',
    image: '/placeholder.svg',
    country: 'United States',
    denomination: 'Cent',
    condition: 'Mint',
    description: 'Rare variety with small date on proof.',
    starting_price: 3200,
    current_bid: 4850,
    reserve_price: 5000,
    auction_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    bid_count: 16,
    seller_id: 'dealer-1',
    highest_bidder_id: 'user-10',
    watchers: 33,
    is_auction: true,
    profiles: {
      name: 'Premium Coins USA',
      reputation: 98,
      verified_dealer: true
    }
  }
  // Adding 40 more auction coins with varying end times and bid amounts...
];

// Add 40 more coins to reach 50 total
for (let i = 11; i <= 50; i++) {
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
  const randomRarity = ['Common', 'Uncommon', 'Rare', 'Ultra Rare'][Math.floor(Math.random() * 4)];
  const multiplier = randomRarity === 'Ultra Rare' ? 10 : randomRarity === 'Rare' ? 5 : randomRarity === 'Uncommon' ? 2 : 1;
  const startingPrice = randomType.basePrice * multiplier;
  const currentBid = startingPrice + Math.floor(Math.random() * startingPrice * 0.5);
  const reservePrice = currentBid + Math.floor(Math.random() * 50);
  
  // Random auction end times from 1 hour to 7 days
  const hoursFromNow = Math.floor(Math.random() * (7 * 24)) + 1;
  const auctionEnd = new Date(Date.now() + hoursFromNow * 60 * 60 * 1000).toISOString();
  
  const bidCount = Math.floor(Math.random() * 25) + 1;
  const watchers = Math.floor(Math.random() * 50) + 5;
  
  const dealers = [
    { name: 'Premium Coins USA', rep: 98 },
    { name: 'Heritage Numismatics', rep: 95 },
    { name: 'Rare Coin Experts', rep: 92 },
    { name: 'Error Coin Specialists', rep: 96 },
    { name: 'Elite Coin Gallery', rep: 99 }
  ];
  const randomDealer = dealers[Math.floor(Math.random() * dealers.length)];
  
  mockAuctionCoins.push({
    id: `auction-${i}`,
    name: `${randomYear} ${randomType.name}`,
    year: randomYear,
    grade: randomGrade,
    rarity: randomRarity as any,
    image: '/placeholder.svg',
    country: 'United States',
    denomination: randomType.denom,
    condition: 'Excellent',
    description: `Beautiful ${randomYear} ${randomType.name} in ${randomGrade} condition.`,
    starting_price: startingPrice,
    current_bid: currentBid,
    reserve_price: reservePrice,
    auction_end: auctionEnd,
    bid_count: bidCount,
    seller_id: `dealer-${(i % 5) + 1}`,
    highest_bidder_id: `user-${(i % 10) + 1}`,
    watchers: watchers,
    is_auction: true,
    profiles: {
      name: randomDealer.name,
      reputation: randomDealer.rep,
      verified_dealer: true
    }
  });
}
