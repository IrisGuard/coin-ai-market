
export interface SearchFilters {
  query: string;
  category: string;
  country: string;
  yearFrom: string;
  yearTo: string;
  priceFrom: string;
  priceTo: string;
  rarity: string;
  condition: string;
  mintMark: string;
  hasImage: boolean;
  isAuction: boolean;
  hasGrading: boolean;
  sortBy: string;
}

export interface SearchAnalytics {
  totalResults: number;
  searchTime: number;
  relevanceScore: number;
  popularityIndex: number;
  priceRange: {
    min: number;
    max: number;
    average: number;
  };
  categories: Record<string, number>;
  rarityDistribution: Record<string, number>;
}

export interface SearchSuggestion {
  text: string;
  type: 'coin' | 'country' | 'category' | 'year';
  count?: number;
}

export interface SearchHistory {
  query: string;
  timestamp: Date;
  resultCount: number;
}

export interface AutocompleteResult {
  text: string;
  type: 'suggestion' | 'history' | 'trending';
  icon?: string;
}
