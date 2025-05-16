
import { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { marketplaceCoins } from '@/data/marketplaceCoins';
import { Coin } from '@/types/coin';
import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader';
import MarketplaceFilterPanel from '@/components/marketplace/MarketplaceFilterPanel';
import MarketplaceGrid from '@/components/marketplace/MarketplaceGrid';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuctionOnly, setIsAuctionOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'year'>('price');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);

  const filteredCoins = marketplaceCoins
    .filter(coin => {
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return coin.name.toLowerCase().includes(searchLower) || 
               coin.year.toString().includes(searchLower) ||
               coin.grade.toLowerCase().includes(searchLower);
      }
      return true;
    })
    .filter(coin => {
      // Apply auction filter
      if (isAuctionOnly) {
        return coin.isAuction === true;
      }
      return true;
    })
    .filter(coin => {
      // Apply rarity filter
      if (selectedRarity) {
        return coin.rarity === selectedRarity;
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

  const handleSort = useCallback((field: 'price' | 'year') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  }, [sortBy, sortDirection]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setIsAuctionOnly(false);
    setSelectedRarity(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MarketplaceHeader 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
          />
          
          <MarketplaceFilterPanel 
            isAuctionOnly={isAuctionOnly}
            setIsAuctionOnly={setIsAuctionOnly}
            selectedRarity={selectedRarity}
            setSelectedRarity={setSelectedRarity}
            sortBy={sortBy}
            sortDirection={sortDirection}
            handleSort={handleSort}
          />
          
          <MarketplaceGrid 
            filteredCoins={filteredCoins}
            searchTerm={searchTerm}
            isAuctionOnly={isAuctionOnly}
            selectedRarity={selectedRarity}
            clearFilters={clearFilters}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Marketplace;
