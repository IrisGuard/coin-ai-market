
import { useMemo } from 'react';
import { Coin } from '@/types/coin';
import { CategoryFilters } from './useCategoryFilters';

export const useCategoryFiltering = (categoryCoins: Coin[], filters: CategoryFilters) => {
  // Apply filters and sorting
  const filteredCoins = useMemo(() => {
    if (!categoryCoins) return [];

    let filtered = [...categoryCoins];

    // Search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(coin =>
        coin.name.toLowerCase().includes(searchLower) ||
        (coin.description && coin.description.toLowerCase().includes(searchLower)) ||
        (coin.country && coin.country.toLowerCase().includes(searchLower))
      );
    }

    // Price range filter
    filtered = filtered.filter(coin =>
      coin.price >= filters.priceRange[0] && coin.price <= filters.priceRange[1]
    );

    // Year range filter
    filtered = filtered.filter(coin =>
      coin.year >= filters.yearRange[0] && coin.year <= filters.yearRange[1]
    );

    // Country filter
    if (filters.selectedCountry) {
      filtered = filtered.filter(coin => coin.country === filters.selectedCountry);
    }

    // Condition filter
    if (filters.selectedCondition) {
      filtered = filtered.filter(coin => coin.condition === filters.selectedCondition);
    }

    // Rarity filter
    if (filters.selectedRarity) {
      filtered = filtered.filter(coin => coin.rarity === filters.selectedRarity);
    }

    // Auctions only filter
    if (filters.showAuctionsOnly) {
      filtered = filtered.filter(coin => coin.is_auction);
    }

    // Featured only filter
    if (filters.showFeaturedOnly) {
      filtered = filtered.filter(coin => coin.featured);
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'year-old':
        filtered.sort((a, b) => a.year - b.year);
        break;
      case 'year-new':
        filtered.sort((a, b) => b.year - a.year);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
        break;
    }

    return filtered;
  }, [categoryCoins, filters]);

  return { filteredCoins };
};
