'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Store, ArrowRight, Heart, Eye, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ImageGallery from '@/components/ui/ImageGallery';
import CoinCard from './CoinCard';
import LazyImage from '@/components/ui/LazyImage';
import { Coin } from '@/types/coin';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch';
import SearchBar from '@/components/search/SearchBar';
import AdvancedSearchFilters from '@/components/search/AdvancedSearchFilters';
import MobileFilterDrawer from '@/components/search/MobileFilterDrawer';
import { useIsMobile } from '@/hooks/use-mobile';

const FeaturedCoinsGrid = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const coinsPerPage = 100; // Exactly 100 coins per page as requested
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [showDesktopFilters, setShowDesktopFilters] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const isMobile = useIsMobile();

  // Client-side only rendering to fix SSR issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // PHASE 6: Advanced Search Integration - Always use hook
  const searchHookResult = useAdvancedSearch(currentPage, coinsPerPage);
  
  const {
    filters = { query: '', country: '', yearFrom: '', yearTo: '', priceFrom: '', priceTo: '', grade: '', rarity: '', category: '', sortBy: 'name' as const, sortOrder: 'desc' as const },
    updateFilters = () => {},
    clearFilters = () => {},
    hasActiveFilters = false,
    searchResults = [],
    totalCount = 0,
    isLoading = false,
    error = null,
    filterOptions = { countries: [], grades: [], rarities: [], categories: [], yearRange: { min: 1800, max: 2024 }, priceRange: { min: 0, max: 10000 } },
    isFiltersPanelOpen = false,
    setIsFiltersPanelOpen = () => {}
  } = searchHookResult || {};

  const featuredCoins = searchResults;
  const totalCoins = totalCount;
  const totalPages = Math.ceil(totalCoins / coinsPerPage);

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => 
    key !== 'sortBy' && key !== 'sortOrder' && value !== ''
  ).length;

  const handleCoinClick = (coin: Coin) => {
    setSelectedCoin(coin);
    // Navigate to coin detail page
    window.location.href = `/coin/${coin.id}`;
  };

  const handleSearchChange = (query: string) => {
    updateFilters({ query });
  };

  const handleFiltersToggle = () => {
    if (isMobile) {
      setIsFiltersPanelOpen(!isFiltersPanelOpen);
    } else {
      setShowDesktopFilters(!showDesktopFilters);
    }
  };

  // Enhanced loading state with better performance
  if (!isClient || isLoading) {
    return (
      <div className="space-y-6">
        {/* Enhanced Search Bar Skeleton */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="h-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-2xl animate-pulse shadow-lg" />
        </div>
        
        {/* Enhanced Grid Skeleton */}
        <div className="loading-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div 
              key={i} 
              className="gpu-accelerated"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite] -translate-x-full" />
                </div>
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                  <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error || (!isLoading && !featuredCoins?.length)) {
    return (
      <div className="space-y-6 sm:space-y-8">
        {/* Search Bar (always visible) */}
        <SearchBar
          value={filters.query}
          onChange={handleSearchChange}
          onFiltersToggle={handleFiltersToggle}
          hasActiveFilters={hasActiveFilters}
          activeFiltersCount={activeFiltersCount}
          placeholder="Search coins, countries, categories..."
        />

        {hasActiveFilters ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">No Results Found</h3>
            <p className="text-gray-600 mb-4">
              No coins match your current search criteria. Try adjusting your filters.
            </p>
            <Button onClick={clearFilters} className="bg-blue-600 hover:bg-blue-700">
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🪙</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">No Coins Available</h3>
            <p className="text-gray-600">Check back soon for coins from our verified dealers.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* PHASE 6: Advanced Search System */}
      <div className="space-y-4">
        {/* Search Bar */}
        <SearchBar
          value={filters.query}
          onChange={handleSearchChange}
          onFiltersToggle={handleFiltersToggle}
          hasActiveFilters={hasActiveFilters}
          activeFiltersCount={activeFiltersCount}
          placeholder="Search coins, countries, categories..."
        />

        {/* Desktop Filters */}
        {!isMobile && showDesktopFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <AdvancedSearchFilters
              filters={filters}
              filterOptions={filterOptions}
              onFiltersChange={updateFilters}
              onClearFilters={clearFilters}
              resultsCount={totalCoins}
            />
          </motion.div>
        )}

        {/* Mobile Filter Drawer */}
        {isMobile && (
          <MobileFilterDrawer
            isOpen={isFiltersPanelOpen}
            onClose={() => setIsFiltersPanelOpen(false)}
            filters={filters}
            onFiltersChange={updateFilters}
            onClearFilters={clearFilters}
            filterOptions={filterOptions}
            resultsCount={totalCoins}
          />
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600">Active filters:</span>
            {Object.entries(filters).map(([key, value]) => {
              if (key === 'sortBy' || key === 'sortOrder' || !value) return null;
              return (
                <Badge 
                  key={key}
                  variant="secondary" 
                  className="cursor-pointer hover:bg-red-100"
                  onClick={() => updateFilters({ [key]: '' })}
                >
                  {key}: {value} ×
                </Badge>
              );
            })}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-red-600 hover:text-red-700"
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {featuredCoins?.length || 0} of {totalCoins} coins
            {hasActiveFilters && ' (filtered)'}
          </span>
          {!isLoading && totalCoins === 0 && hasActiveFilters && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700"
            >
              Clear filters to see all coins
            </Button>
          )}
        </div>
      </div>

      {/* CONTAINER-ENFORCED: Responsive Grid Layout with strict boundaries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
        {featuredCoins.map((coin, index) => (
          <div 
            key={coin.id} 
            className="w-full min-w-0" 
            style={{ 
              boxSizing: 'border-box',
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
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
