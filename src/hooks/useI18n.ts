
// Simple hook that returns English text directly without internationalization
export const useI18n = () => {
  const t = (key: string): string => {
    // Simple mapping for common keys, defaulting to the key itself
    const translations: Record<string, string> = {
      // Navigation
      'nav.marketplace': 'Marketplace',
      'nav.auctions': 'Auctions',
      'nav.search': 'Search',
      'nav.upload': 'Upload',
      'nav.dashboard': 'Dashboard',
      'nav.logout': 'Logout',
      'nav.login': 'Login',
      
      // Marketplace
      'marketplace.title': 'Global Coin Marketplace',
      'marketplace.subtitle': 'Discover, buy and sell authenticated coins from collectors worldwide',
      'marketplace.search.placeholder': 'Search coins, years, countries, or descriptions...',
      'marketplace.stats.total': 'Total Coins',
      'marketplace.stats.auctions': 'Live Auctions',
      'marketplace.stats.featured': 'Featured',
      'marketplace.stats.totalValue': 'Total Value',
      'marketplace.filters.liveAuctions': 'Live Auctions',
      'marketplace.filters.featuredOnly': 'Featured Only',
      'marketplace.filters.condition': 'Condition',
      'marketplace.filters.allConditions': 'All Conditions',
      'marketplace.filters.sortBy': 'Sort By',
      'marketplace.filters.display': 'Display',
      'marketplace.filters.actions': 'Actions',
      'marketplace.filters.clearFilters': 'Clear Filters',
      'marketplace.filters.coinsFound': 'coins found',
      'marketplace.filters.loading': 'Loading...',
      'marketplace.noResults.title': 'No coins found',
      'marketplace.noResults.subtitle': 'Try different search criteria',
      'marketplace.coin.buyNow': 'Buy Now',
      'marketplace.coin.endingIn': 'Ending in',
      'marketplace.coin.views': 'views',
      'marketplace.coin.favorites': 'favorites',
      
      // Sort options
      'sort.newest': 'Newest First',
      'sort.popularity': 'Most Popular',
      'sort.priceLow': 'Price: Low to High',
      'sort.priceHigh': 'Price: High to Low',
      'sort.yearOld': 'Year: Oldest First',
      'sort.yearNew': 'Year: Newest First',
      'sort.name': 'Name: A to Z',
      
      // Toast messages
      'toast.addedToFavorites': 'Added to favorites',
      'toast.errorAdding': 'Error adding to favorites',
      'toast.errorLoading': 'Error loading coins'
    };

    return translations[key] || key;
  };

  return { t, language: 'en' };
};
