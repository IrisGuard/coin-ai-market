
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Coin } from '@/types/coin';
import { marketplaceCoins } from '@/data/marketplaceCoins'; // Fallback data

export const useCoins = (options?: {
  rarity?: string | null;
  isAuctionOnly?: boolean;
  searchTerm?: string;
  sortBy?: 'price' | 'year';
  sortDirection?: 'asc' | 'desc';
}) => {
  const {
    rarity = null,
    isAuctionOnly = false,
    searchTerm = '',
    sortBy = 'price',
    sortDirection = 'desc'
  } = options || {};

  // Fetch coins from Supabase
  const fetchCoins = async (): Promise<Coin[]> => {
    try {
      let query = supabase
        .from('coins')
        .select('*');
      
      // Apply filters
      if (rarity) {
        query = query.eq('rarity', rarity);
      }
      
      if (isAuctionOnly) {
        query = query.eq('is_auction', true);
      }
      
      if (searchTerm) {
        query = query.or(
          `name.ilike.%${searchTerm}%,year.eq.${parseInt(searchTerm) || 0},grade.ilike.%${searchTerm}%`
        );
      }
      
      // Apply sorting
      query = query.order(sortBy, { ascending: sortDirection === 'asc' });
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return data.map(item => ({
        ...item,
        isAuction: item.is_auction,
        timeLeft: item.auction_end ? getTimeLeft(new Date(item.auction_end)) : undefined,
      })) as Coin[];
    } catch (error) {
      console.error('Error fetching coins:', error);
      
      // Return static data as fallback
      console.log('Using fallback data');
      return filterStaticData();
    }
  };

  // Helper function to filter static data (fallback)
  const filterStaticData = (): Coin[] => {
    return marketplaceCoins
      .filter(coin => {
        // Apply rarity filter
        if (rarity && coin.rarity !== rarity) {
          return false;
        }
        
        // Apply auction filter
        if (isAuctionOnly && !coin.isAuction) {
          return false;
        }
        
        // Apply search filter
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          return coin.name.toLowerCase().includes(searchLower) || 
                coin.year.toString().includes(searchLower) ||
                coin.grade.toLowerCase().includes(searchLower);
        }
        
        return true;
      })
      .sort((a, b) => {
        // Apply sorting
        if (sortBy === 'price') {
          return sortDirection === 'asc' ? a.price - b.price : b.price - a.price;
        } else {
          return sortDirection === 'asc' ? a.year - b.year : b.year - a.year;
        }
      });
  };

  // Calculate time left for auctions
  const getTimeLeft = (endDate: Date): string => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    
    if (diff <= 0) {
      return 'Ended';
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  return useQuery({
    queryKey: ['coins', rarity, isAuctionOnly, searchTerm, sortBy, sortDirection],
    queryFn: fetchCoins,
  });
};

// Hook for fetching featured coins
export const useFeaturedCoins = () => {
  const fetchFeaturedCoins = async (): Promise<Coin[]> => {
    try {
      const { data, error } = await supabase
        .from('coins')
        .select('*')
        .in('rarity', ['Rare', 'Ultra Rare'])
        .limit(5);
      
      if (error) {
        throw error;
      }
      
      return data.map(item => ({
        ...item,
        isAuction: item.is_auction,
        timeLeft: item.auction_end ? getTimeLeft(new Date(item.auction_end)) : undefined,
      })) as Coin[];
    } catch (error) {
      console.error('Error fetching featured coins:', error);
      
      // Return static data as fallback
      return marketplaceCoins
        .filter(coin => coin.rarity === 'Rare' || coin.rarity === 'Ultra Rare')
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
    }
  };

  // Calculate time left for auctions
  const getTimeLeft = (endDate: Date): string => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    
    if (diff <= 0) {
      return 'Ended';
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  return useQuery({
    queryKey: ['featuredCoins'],
    queryFn: fetchFeaturedCoins,
  });
};

// Hook for fetching a single coin
export const useCoin = (id: string) => {
  const fetchCoin = async (): Promise<Coin> => {
    try {
      const { data, error } = await supabase
        .from('coins')
        .select(`
          *,
          bids(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      // Update view count
      await supabase
        .from('coins')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', id);
      
      return {
        ...data,
        isAuction: data.is_auction,
        timeLeft: data.auction_end ? getTimeLeft(new Date(data.auction_end)) : undefined,
        bids: data.bids?.map(bid => ({
          amount: bid.amount,
          bidder: bid.user_id,
          time: bid.created_at
        }))
      } as Coin;
    } catch (error) {
      console.error('Error fetching coin:', error);
      
      // Return static data as fallback
      const staticCoin = marketplaceCoins.find(c => c.id === id);
      
      if (!staticCoin) {
        throw new Error('Coin not found');
      }
      
      return staticCoin;
    }
  };

  // Calculate time left for auctions
  const getTimeLeft = (endDate: Date): string => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    
    if (diff <= 0) {
      return 'Ended';
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  return useQuery({
    queryKey: ['coin', id],
    queryFn: fetchCoin,
  });
};
