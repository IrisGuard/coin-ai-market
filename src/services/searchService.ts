
import { supabase } from '@/integrations/supabase/client';
import { Coin } from '@/types/coin';

export interface SearchParams {
  query: string;
  category?: string;
  country?: string;
  yearFrom?: number;
  yearTo?: number;
  priceFrom?: number;
  priceTo?: number;
  rarity?: string;
  condition?: string;
  isAuction?: boolean;
  hasImage?: boolean;
  sortBy?: 'relevance' | 'price-low' | 'price-high' | 'year-old' | 'year-new' | 'name';
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  coins: Coin[];
  total: number;
  searchTime: number;
  suggestions: string[];
}

class SearchService {
  private searchHistory: string[] = [];
  private maxHistoryItems = 20;

  async search(params: SearchParams): Promise<SearchResult> {
    const startTime = Date.now();
    
    try {
      let query = supabase
        .from('coins')
        .select('*', { count: 'exact' });

      // Apply text search
      if (params.query) {
        query = query.or(`name.ilike.%${params.query}%, description.ilike.%${params.query}%, country.ilike.%${params.query}%`);
        this.addToHistory(params.query);
      }

      // Apply filters
      if (params.category) {
        query = query.eq('category', params.category);
      }

      if (params.country) {
        query = query.eq('country', params.country);
      }

      if (params.yearFrom) {
        query = query.gte('year', params.yearFrom);
      }

      if (params.yearTo) {
        query = query.lte('year', params.yearTo);
      }

      if (params.priceFrom) {
        query = query.gte('price', params.priceFrom);
      }

      if (params.priceTo) {
        query = query.lte('price', params.priceTo);
      }

      if (params.rarity) {
        query = query.eq('rarity', params.rarity);
      }

      if (params.condition) {
        query = query.eq('condition', params.condition);
      }

      if (params.isAuction !== undefined) {
        query = query.eq('is_auction', params.isAuction);
      }

      if (params.hasImage) {
        query = query.not('image', 'is', null);
      }

      // Apply sorting
      if (params.sortBy) {
        switch (params.sortBy) {
          case 'price-low':
            query = query.order('price', { ascending: true });
            break;
          case 'price-high':
            query = query.order('price', { ascending: false });
            break;
          case 'year-old':
            query = query.order('year', { ascending: true });
            break;
          case 'year-new':
            query = query.order('year', { ascending: false });
            break;
          case 'name':
            query = query.order('name', { ascending: true });
            break;
          default:
            query = query.order('created_at', { ascending: false });
        }
      }

      // Apply pagination
      if (params.limit) {
        query = query.limit(params.limit);
      }

      if (params.offset) {
        query = query.range(params.offset, params.offset + (params.limit || 20) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      const searchTime = Date.now() - startTime;
      const suggestions = await this.generateSuggestions(params.query || '');

      return {
        coins: data || [],
        total: count || 0,
        searchTime,
        suggestions
      };
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  async generateSuggestions(query: string): Promise<string[]> {
    if (query.length < 2) return [];

    try {
      const { data } = await supabase
        .from('coins')
        .select('name, country')
        .or(`name.ilike.%${query}%, country.ilike.%${query}%`)
        .limit(10);

      const suggestions = new Set<string>();
      data?.forEach(coin => {
        if (coin.name?.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(coin.name);
        }
        if (coin.country?.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(coin.country);
        }
      });

      return Array.from(suggestions).slice(0, 5);
    } catch (error) {
      console.error('Suggestions error:', error);
      return [];
    }
  }

  addToHistory(query: string) {
    if (!query || this.searchHistory.includes(query)) return;
    
    this.searchHistory.unshift(query);
    if (this.searchHistory.length > this.maxHistoryItems) {
      this.searchHistory = this.searchHistory.slice(0, this.maxHistoryItems);
    }
    
    localStorage.setItem('coinai_search_history', JSON.stringify(this.searchHistory));
  }

  getSearchHistory(): string[] {
    if (this.searchHistory.length === 0) {
      const saved = localStorage.getItem('coinai_search_history');
      if (saved) {
        this.searchHistory = JSON.parse(saved);
      }
    }
    return this.searchHistory;
  }

  clearHistory() {
    this.searchHistory = [];
    localStorage.removeItem('coinai_search_history');
  }

  async getTrendingSearches(): Promise<string[]> {
    // In a real implementation, this would come from analytics
    return [
      'Morgan Dollar',
      'Walking Liberty',
      'Peace Dollar',
      'Mercury Dime',
      'Buffalo Nickel'
    ];
  }
}

export const searchService = new SearchService();
