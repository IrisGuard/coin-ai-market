
import React, { useState } from 'react';
import { usePageView } from '@/hooks/usePageView';
import { useEnhancedSearch } from '@/hooks/useEnhancedSearch';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdvancedSearchInterface from '@/components/search/AdvancedSearchInterface';
import SmartSearchSuggestions from '@/components/search/SmartSearchSuggestions';
import SearchAnalytics from '@/components/search/SearchAnalytics';
import DiscoveryFeed from '@/components/search/DiscoveryFeed';
import MarketplaceGrid from '@/components/marketplace/MarketplaceGrid';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EnhancedSearch = () => {
  usePageView();
  
  const {
    search,
    searchResults,
    searchParams,
    searchTime,
    searchHistory,
    isLoading,
    getSearchSuggestions,
    clearSearch
  } = useEnhancedSearch();

  const [activeView, setActiveView] = useState<'search' | 'discover'>('search');
  const [showSuggestions, setShowSuggestions] = useState(true);

  const handleSearch = (searchParams: any) => {
    search(searchParams);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    search({ ...searchParams, query: suggestion });
    setShowSuggestions(false);
  };

  const handleTrendingClick = (trend: string) => {
    search({ ...searchParams, query: trend });
    setShowSuggestions(false);
  };

  const handleCoinClick = (coinId: string) => {
    // Navigate to coin details
    console.log('Navigate to coin:', coinId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Enhanced Search & Discovery
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover coins with our advanced AI-powered search engine and intelligent discovery features
          </p>
        </div>

        {/* Main Content */}
        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="search">Advanced Search</TabsTrigger>
            <TabsTrigger value="discover">Discovery Feed</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Search Interface */}
              <div className="lg:col-span-3 space-y-6">
                <AdvancedSearchInterface
                  onSearch={handleSearch}
                  searchResults={searchResults}
                  isLoading={isLoading}
                />

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="space-y-6">
                    <MarketplaceGrid
                      filteredCoins={searchResults}
                      searchTerm={searchParams.query}
                      isAuctionOnly={searchParams.isAuction}
                      selectedRarity={searchParams.rarity}
                      clearFilters={clearSearch}
                    />
                    
                    <SearchAnalytics
                      searchQuery={searchParams.query}
                      searchResults={searchResults}
                      searchTime={searchTime}
                    />
                  </div>
                )}

                {/* No Results */}
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

              {/* Sidebar */}
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
            <DiscoveryFeed onCoinClick={handleCoinClick} />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default EnhancedSearch;
