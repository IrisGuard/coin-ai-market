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
  const coinsPerPage = 100;
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['featuredCoins', currentPage],
    queryFn: async () => {
      const from = (currentPage - 1) * coinsPerPage;
      const to = from + coinsPerPage - 1;

      // 🔍 DEBUG: Ελέγχω όλα τα νομίσματα στη βάση
      const { data: debugAllCoins, error: debugAllError } = await supabase
        .from('coins')
        .select('*')
        .order('created_at', { ascending: false });
        
      console.log('🏛️ ALL COINS IN DATABASE:', {
        total: debugAllCoins?.length || 0,
        buyNow: debugAllCoins?.filter(coin => !coin.is_auction).length || 0,
        auction: debugAllCoins?.filter(coin => coin.is_auction).length || 0,
        featured: debugAllCoins?.filter(coin => coin.featured).length || 0,
        withBlobImages: debugAllCoins?.filter(coin => coin.image?.startsWith('blob:')).length || 0,
        withValidImages: debugAllCoins?.filter(coin => coin.image && !coin.image.startsWith('blob:')).length || 0
      });
      
      if (debugAllCoins?.length > 0) {
        console.log('📋 FIRST 5 COINS:', debugAllCoins.slice(0, 5).map(coin => ({
          id: coin.id,
          name: coin.name,
          price: coin.price,
          is_auction: coin.is_auction,
          featured: coin.featured,
          store_id: coin.store_id,
          category: coin.category,
          image: coin.image ? (coin.image.startsWith('blob:') ? 'BLOB_URL' : 'VALID_URL') : 'NO_IMAGE',
          created_at: coin.created_at
        })));
      }

      // Fetch coins for the current page - SHOW ALL BUY NOW COINS ON HOME PAGE
      const { data: coins, error: coinsError } = await supabase
        .from('coins')
        .select('*')
        .eq('is_auction', false) // SHOW ALL BUY NOW COINS, NOT JUST FEATURED
        .order('created_at', { ascending: false })
        .range(from, to);

      if (coinsError) {
        throw coinsError;
      }

      // Fetch the total count of Buy Now coins
      const { count, error: countError } = await supabase
        .from('coins')
        .select('*', { count: 'exact', head: true })
        .eq('is_auction', false); // COUNT ALL BUY NOW COINS

      if (countError) {
        throw countError;
      }
      
      const coinData = (coins || []).map(coin => mapSupabaseCoinToCoin(coin));

      return { coins: coinData, count: count ?? 0 };
    }
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-t-xl"></div>
            <div className="p-6 space-y-3 bg-white rounded-b-xl">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
    <div className="space-y-8">
      {/* Enhanced Grid Layout with CoinCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {featuredCoins.map((coin, index) => (
          <CoinCard
            key={coin.id}
            coin={coin}
            index={index}
            onCoinClick={handleCoinClick}
            showManagementOptions={true}
          />
        ))}
      </div>

      {/* Enhanced Pagination Controls */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>

            {/* Show numbered pagination */}
            {(() => {
              const pages = [];
              const maxVisible = 5;
              
              let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
              let endPage = Math.min(totalPages, startPage + maxVisible - 1);
              
              // Adjust start if we're near the end
              if (endPage - startPage < maxVisible - 1) {
                startPage = Math.max(1, endPage - maxVisible + 1);
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
                      className={currentPage === i ? 'bg-blue-600 text-white' : ''}
                    >
                      {i}
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
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Call to Action Removed - Using pagination instead */}
    </div>
  );
};

export default FeaturedCoinsGrid;
