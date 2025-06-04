
export const getGlobalSourcesData = () => {
  return [
    {
      source_name: "Heritage Auctions",
      source_type: "auction",
      base_url: "https://coins.ha.com",
      category_name: "Auction Houses",
      region_name: "North America",
      template_name: "Heritage Template",
      requires_proxy: false,
      rate_limit_per_hour: 60,
      priority_score: 90,
      supported_currencies: ["USD"],
      market_focus: ["rare_coins", "error_coins"]
    },
    {
      source_name: "Stack's Bowers",
      source_type: "auction",
      base_url: "https://www.stacksbowers.com",
      category_name: "Auction Houses",
      region_name: "North America",
      template_name: "Stack's Template",
      requires_proxy: false,
      rate_limit_per_hour: 60,
      priority_score: 85,
      supported_currencies: ["USD"],
      market_focus: ["rare_coins", "ancient_coins"]
    },
    {
      source_name: "PCGS Price Guide",
      source_type: "price_guide",
      base_url: "https://www.pcgs.com/prices",
      category_name: "Reference Guides",
      region_name: "North America",
      template_name: "PCGS Template",
      requires_proxy: false,
      rate_limit_per_hour: 120,
      priority_score: 95,
      supported_currencies: ["USD"],
      market_focus: ["graded_coins"]
    },
    {
      source_name: "NGC Price Guide",
      source_type: "price_guide",
      base_url: "https://www.ngccoin.com/price-guide",
      category_name: "Reference Guides",
      region_name: "North America",
      template_name: "NGC Template",
      requires_proxy: false,
      rate_limit_per_hour: 120,
      priority_score: 95,
      supported_currencies: ["USD"],
      market_focus: ["graded_coins"]
    },
    {
      source_name: "eBay Sold Listings",
      source_type: "marketplace",
      base_url: "https://www.ebay.com",
      category_name: "Marketplaces",
      region_name: "Global",
      template_name: "eBay Template",
      requires_proxy: true,
      rate_limit_per_hour: 30,
      priority_score: 70,
      supported_currencies: ["USD", "EUR", "GBP"],
      market_focus: ["general", "error_coins"]
    },
    {
      source_name: "CoinWorld",
      source_type: "news",
      base_url: "https://www.coinworld.com",
      category_name: "News & Analysis",
      region_name: "North America",
      template_name: "News Template",
      requires_proxy: false,
      rate_limit_per_hour: 60,
      priority_score: 60,
      supported_currencies: ["USD"],
      market_focus: ["market_analysis"]
    }
  ];
};
