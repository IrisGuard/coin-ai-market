import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Store, ArrowRight, Heart, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ImageGallery from '@/components/ui/ImageGallery';
import CoinCard from './CoinCard';
import { Coin, mapSupabaseCoinToCoin } from '@/types/coin';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface Store {
  id: string;
  name: string;
  user_id: string;
}

const FeaturedCoinsGrid = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const coinsPerPage = 100; // Exactly 100 coins per page as requested
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['featuredCoins', currentPage],
    queryFn: async () => {
      const from = (currentPage - 1) * coinsPerPage;
      const to = from + coinsPerPage - 1;

      // PHASE 5: Optimized database query with performance improvements
      const { data: coins, error: coinsError } = await supabase
        .from('coins')
        .select('*')
        .eq('is_auction', false) // Only Buy Now coins for homepage
        .eq('listing_type', 'direct_sale') // Ensure only direct sale coins
        .order('created_at', { ascending: false })
        .range(from, to);

      if (coinsError) {
        throw coinsError;
      }

      // PHASE 5: Concurrent count query for better performance
      const { count, error: countError } = await supabase
        .from('coins')
        .select('*', { count: 'exact', head: true })
        .eq('is_auction', false)
        .eq('listing_type', 'direct_sale');

      if (countError) {
        throw countError;
      }
      
      const coinData = (coins || []).map(coin => mapSupabaseCoinToCoin(coin));

      return { coins: coinData, count: count ?? 0 };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchInterval: 30000, // Refresh every 30 seconds
    refetchOnWindowFocus: true,
  });

  const featuredCoins = data?.coins;
  const totalCoins = data?.count ?? 0;
  const totalPages = Math.ceil(totalCoins / coinsPerPage);

  const { data: stores } = useQuery({
    queryKey: ['stores'],
    queryFn: async (): Promise<Store[]> => {
      const { data, error } = await supabase
        .from('stores')
        .select('id, name, user_id');

      if (error) {
        return [];
      }

      return data || [];
    }
  });

  const handleCoinClick = (coin: Coin) => {
    setSelectedCoin(coin);
    // Navigate to coin detail page
    window.location.href = `/coin/${coin.id}`;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl mb-3">
              <div className="absolute inset-0 shimmer"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded shimmer"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 shimmer"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 shimmer"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !featuredCoins?.length) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🪙</div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900">No Featured Coins Available</h3>
        <p className="text-gray-600">Check back soon for featured coins from our verified dealers.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* CONTAINER-ENFORCED: Responsive Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 auto-rows-max overflow-hidden">
        {featuredCoins.map((coin, index) => (
          <div key={coin.id} className="w-full max-w-full min-w-0 overflow-hidden" style={{ boxSizing: 'border-box' }}>
            <CoinCard
              coin={coin}
              index={index}
              onCoinClick={handleCoinClick}
              showManagementOptions={false}
              hideDebugInfo={true}
            />
          </div>
        ))}
      </div>

      {/* PHASE 5: Enhanced Mobile-Optimized Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent className="flex-wrap gap-1 sm:gap-2">
              <PaginationItem>
                <PaginationPrevious 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : ''} touch-manipulation`}
                />
              </PaginationItem>

              {/* PHASE 5: Smart pagination for mobile */}
              {(() => {
                const pages = [];
                const maxVisible = window.innerWidth < 640 ? 3 : 5; // Fewer pages on mobile
                
                let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                let endPage = Math.min(totalPages, startPage + maxVisible - 1);
                
                if (endPage - startPage < maxVisible - 1) {
                  startPage = Math.max(1, endPage - maxVisible + 1);
                }
                
                // Show first page if not visible
                if (startPage > 1) {
                  pages.push(
                    <PaginationItem key={1}>
                      <PaginationLink 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(1);
                        }}
                        className="touch-manipulation"
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                  );
                  if (startPage > 2) {
                    pages.push(
                      <PaginationItem key="dots1">
                        <span className="px-2 text-muted-foreground">...</span>
                      </PaginationItem>
                    );
                  }
                }
                
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <PaginationItem key={i}>
                      <PaginationLink 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(i);
                        }}
                        className={`${currentPage === i ? 'bg-blue-600 text-white' : ''} touch-manipulation min-w-[44px] h-[44px]`}
                      >
                        {i}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                
                // Show last page if not visible
                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pages.push(
                      <PaginationItem key="dots2">
                        <span className="px-2 text-muted-foreground">...</span>
                      </PaginationItem>
                    );
                  }
                  pages.push(
                    <PaginationItem key={totalPages}>
                      <PaginationLink 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(totalPages);
                        }}
                        className="touch-manipulation"
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                
                return pages;
              })()}
              
              <PaginationItem>
                <PaginationNext 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                  className={`${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''} touch-manipulation`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Call to Action Removed - Using pagination instead */}
    </div>
  );
};

export default FeaturedCoinsGrid;
