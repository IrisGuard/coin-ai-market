
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketplaceService } from '@/services/marketplaceService';
import { useState } from 'react';

interface SearchFilters {
  category?: string;
  price_min?: number;
  price_max?: number;
  listing_type?: string;
  sort_by?: string;
}

export const useListings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const queryClient = useQueryClient();

  const { data: listings, isLoading, error } = useQuery({
    queryKey: ['marketplace-listings', searchQuery, filters],
    queryFn: () => marketplaceService.searchListings(searchQuery, filters),
    enabled: true
  });

  const addToWishlistMutation = useMutation({
    mutationFn: (coinId: string) => marketplaceService.addToWishlist(coinId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    }
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: (coinId: string) => marketplaceService.removeFromWishlist(coinId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    }
  });

  const updateSearch = (query: string) => {
    setSearchQuery(query);
  };

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  return {
    listings: listings || [],
    isLoading,
    error,
    searchQuery,
    filters,
    updateSearch,
    updateFilters,
    clearFilters,
    addToWishlist: addToWishlistMutation.mutate,
    removeFromWishlist: removeFromWishlistMutation.mutate,
    isAddingToWishlist: addToWishlistMutation.isPending,
    isRemovingFromWishlist: removeFromWishlistMutation.isPending
  };
};
