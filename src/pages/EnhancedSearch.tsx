
import React from 'react';
import { usePageView } from '@/hooks/usePageView';
import { useCoins } from '@/hooks/useCoins';
import { useSearchFiltering } from '@/hooks/search/useSearchFiltering';
import { useSearchSorting } from '@/hooks/search/useSearchSorting';
import { useSearchSuggestions } from '@/hooks/search/useSearchSuggestions';
import { createDefaultSearchParams } from '@/utils/searchUtils';
import { useSearchHandlers } from '@/hooks/useSearchHandlers';
import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdvancedSearchInterface from '@/components/search/AdvancedSearchInterface';
import SmartSearchSuggestions from '@/components/search/SmartSearchSuggestions';
import SearchAnalytics from '@/components/search/SearchAnalytics';
import DiscoveryFeed from '@/components/search/discovery/DiscoveryFeed';
import MarketplaceGrid from '@/components/marketplace/MarketplaceGrid';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EnhancedSearch = () => {
  usePageView();
  
  const { data: allCoins, isLoading } = useCoins();
  const [searchParams, setSearchParams] = useState(createDefaultSearchParams());
  const [searchTime] = useState(0.23);
  const [searchHistory] = useState<string[]>([]);

  const filteredCoins = useSearchFiltering(allCoins, searchParams);
  const searchResults = useSearchSorting(filteredCoins, searchParams);
  const { getSearchSuggestions } = useSearchSuggestions(allCoins);

  const search = (params: typeof searchParams) => {
    setSearchParams(params);
  };

  const clearSearch = () => {
    setSearchParams(createDefaultSearchParams());
  };

  const {
    activeView,
    setActiveView,
    showSuggestions,
    handleSearch,
    handleSuggestionClick,
    handleTrendingClick,
    handleCoinClick
  } = useSearchHandlers(search, searchParams);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Enhanced Search & Discovery
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover coins with our advanced AI-powered search engine and intelligent discovery features
          </p>
        </div>

        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="search">Advanced Search</TabsTrigger>
            <TabsTrigger value="discover">Discovery Feed</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <AdvancedSearchInterface
                  onSearch={handleSearch}
                />

                {searchResults.length > 0 && (
                  <div className="space-y-6">
                    <MarketplaceGrid
                      filteredCoins={searchResults}
                      searchTerm={searchParams.query}
                      isAuctionOnly={searchParams.isAuction}
                      selectedRarity={searchParams.rarity}
                      clearFilters={clearSearch}
                    />
                    
                    {/* Fix: Pass props that SearchAnalytics component expects */}
                    <SearchAnalytics
                      searchQuery={searchParams.query}
                      searchResults={searchResults}
                      searchTime={searchTime}
                    />
                  </div>
                )}

                {!isLoading && searchResults.length === 0 && searchParams.query && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <div className="text-gray-500 mb-4">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold mb-2">No coins found</h3>
                        <p>Try adjusting your search criteria or explore our discovery feed</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-6">
                {showSuggestions && (
                  <SmartSearchSuggestions
                    searchQuery={searchParams.query}
                    onSuggestionClick={handleSuggestionClick}
                    onTrendingClick={handleTrendingClick}
                  />
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="discover">
            {/* Fix: Remove onCoinClick prop that doesn't exist */}
            <DiscoveryFeed />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default EnhancedSearch;
