
export const mockDirectSaleCoins = [
  {
    id: "direct-1",
    name: "1909-S VDB Lincoln Cent",
    year: 1909,
    grade: "MS-64",
    rarity: "Rare",
    image: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400&h=400&fit=crop",
    country: "United States",
    denomination: "Cent",
    condition: "Mint State",
    description: "Iconic first year Lincoln cent with VDB initials. Key date in excellent condition.",
    price: 2850,
    user_id: "dealer-1",
    starting_price: 2850,
    current_bid: 2850,
    reserve_price: 2850,
    auction_end: "",
    bid_count: 0,
    seller_id: "dealer-1",
    highest_bidder_id: null,
    watchers: 12,
    views: 156,
    is_auction: false,
    listing_type: "direct_sale",
    authentication_status: "verified" as const,
    featured: true,
    profiles: {
      id: "dealer-1",
      name: "Heritage Coin Gallery",
      reputation: 98,
      verified_dealer: true,
      avatar_url: ""
    }
  },
  {
    id: "direct-2",
    name: "1916-D Mercury Dime",
    year: 1916,
    grade: "AU-55",
    rarity: "Very Rare",
    image: "https://images.unsplash.com/photo-1634979082319-2b0b6d44db5e?w=400&h=400&fit=crop",
    country: "United States",
    denomination: "Dime",
    condition: "About Uncirculated",
    description: "The key date of the Mercury dime series. Excellent eye appeal with original luster.",
    price: 4200,
    user_id: "dealer-2",
    starting_price: 4200,
    current_bid: 4200,
    reserve_price: 4200,
    auction_end: "",
    bid_count: 0,
    seller_id: "dealer-2",
    highest_bidder_id: null,
    watchers: 18,
    views: 203,
    is_auction: false,
    listing_type: "direct_sale",
    authentication_status: "verified" as const,
    featured: true,
    profiles: {
      id: "dealer-2",
      name: "Classic American Coins",
      reputation: 95,
      verified_dealer: true,
      avatar_url: ""
    }
  },
  {
    id: "direct-3",
    name: "1893-S Morgan Silver Dollar",
    year: 1893,
    grade: "VF-30",
    rarity: "Ultra Rare",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop",
    country: "United States",
    denomination: "Dollar",
    condition: "Very Fine",
    description: "The king of Morgan dollars. Extremely scarce San Francisco issue.",
    price: 125000,
    user_id: "dealer-3",
    starting_price: 125000,
    current_bid: 125000,
    reserve_price: 125000,
    auction_end: "",
    bid_count: 0,
    seller_id: "dealer-3",
    highest_bidder_id: null,
    watchers: 45,
    views: 892,
    is_auction: false,
    listing_type: "direct_sale",
    authentication_status: "verified" as const,
    featured: true,
    profiles: {
      id: "dealer-3",
      name: "Numismatic Treasures LLC",
      reputation: 99,
      verified_dealer: true,
      avatar_url: ""
    }
  },
  {
    id: "direct-4",
    name: "1877 Indian Head Cent",
    year: 1877,
    grade: "XF-45",
    rarity: "Rare",
    image: "https://images.unsplash.com/photo-1635536562479-439d8c69e82e?w=400&h=400&fit=crop",
    country: "United States",
    denomination: "Cent",
    condition: "Extremely Fine",
    description: "Key date Indian Head cent with excellent detail and original color.",
    price: 3850,
    user_id: "dealer-4",
    starting_price: 3850,
    current_bid: 3850,
    reserve_price: 3850,
    auction_end: "",
    bid_count: 0,
    seller_id: "dealer-4",
    highest_bidder_id: null,
    watchers: 22,
    views: 167,
    is_auction: false,
    listing_type: "direct_sale",
    authentication_status: "verified" as const,
    featured: false,
    profiles: {
      id: "dealer-4",
      name: "Colonial Coin Company",
      reputation: 92,
      verified_dealer: true,
      avatar_url: ""
    }
  },
  {
    id: "direct-5",
    name: "1932-D Washington Quarter",
    year: 1932,
    grade: "MS-63",
    rarity: "Rare",
    image: "https://images.unsplash.com/photo-1606479542467-b9b801a3a8d8?w=400&h=400&fit=crop",
    country: "United States",
    denomination: "Quarter",
    condition: "Mint State",
    description: "Key date Washington quarter with outstanding luster and strike.",
    price: 1650,
    user_id: "dealer-5",
    starting_price: 1650,
    current_bid: 1650,
    reserve_price: 1650,
    auction_end: "",
    bid_count: 0,
    seller_id: "dealer-5",
    highest_bidder_id: null,
    watchers: 15,
    views: 134,
    is_auction: false,
    listing_type: "direct_sale",
    authentication_status: "verified" as const,
    featured: false,
    profiles: {
      id: "dealer-5",
      name: "Liberty Coin Exchange",
      reputation: 96,
      verified_dealer: true,
      avatar_url: ""
    }
  }
  // Continue with more coins following the same pattern...
];

// Generate additional 65 coins to reach 70 total
const generateAdditionalCoins = () => {
  const coinTypes = [
    { name: "Walking Liberty Half Dollar", denom: "Half Dollar" },
    { name: "Standing Liberty Quarter", denom: "Quarter" },
    { name: "Barber Dime", denom: "Dime" },
    { name: "Buffalo Nickel", denom: "Nickel" },
    { name: "Peace Silver Dollar", denom: "Dollar" },
    { name: "Franklin Half Dollar", denom: "Half Dollar" },
    { name: "Roosevelt Dime", denom: "Dime" },
    { name: "Jefferson Nickel", denom: "Nickel" },
    { name: "Kennedy Half Dollar", denom: "Half Dollar" },
    { name: "Eisenhower Dollar", denom: "Dollar" }
  ];

  const grades = ["MS-65", "MS-64", "MS-63", "AU-58", "XF-45", "VF-30", "F-15"];
  const rarities = ["Common", "Uncommon", "Rare", "Very Rare"];
  const conditions = ["Mint State", "About Uncirculated", "Extremely Fine", "Very Fine"];

  const additionalCoins = [];
  
  for (let i = 6; i <= 70; i++) {
    const coinType = coinTypes[Math.floor(Math.random() * coinTypes.length)];
    const year = 1900 + Math.floor(Math.random() * 120);
    const grade = grades[Math.floor(Math.random() * grades.length)];
    const rarity = rarities[Math.floor(Math.random() * rarities.length)];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const price = Math.floor(Math.random() * 10000) + 100;
    
    additionalCoins.push({
      id: `direct-${i}`,
      name: `${year} ${coinType.name}`,
      year,
      grade,
      rarity,
      image: `https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400&h=400&fit=crop&sig=${i}`,
      country: "United States",
      denomination: coinType.denom,
      condition,
      description: `Beautiful ${year} ${coinType.name} in ${condition}. Excellent addition to any collection.`,
      price,
      user_id: `dealer-${(i % 10) + 1}`,
      starting_price: price,
      current_bid: price,
      reserve_price: price,
      auction_end: "",
      bid_count: 0,
      seller_id: `dealer-${(i % 10) + 1}`,
      highest_bidder_id: null,
      watchers: Math.floor(Math.random() * 50),
      views: Math.floor(Math.random() * 500),
      is_auction: false,
      listing_type: "direct_sale" as const,
      authentication_status: "verified" as const,
      featured: i <= 15,
      profiles: {
        id: `dealer-${(i % 10) + 1}`,
        name: `Coin Dealer ${(i % 10) + 1}`,
        reputation: 90 + Math.floor(Math.random() * 10),
        verified_dealer: true,
        avatar_url: ""
      }
    });
  }
  
  return additionalCoins;
};

export const allDirectSaleCoins = [...mockDirectSaleCoins, ...generateAdditionalCoins()];
