
import { useState } from 'react';
import { motion } from 'framer-motion';
import MarketplaceFilters from './MarketplaceFilters';
import MarketplaceSorting from './MarketplaceSorting';
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';

interface MarketplaceFilterPanelProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedRarity: string;
  setSelectedRarity: (rarity: string) => void;
  selectedCondition: string;
  setSelectedCondition: (condition: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  showAuctionsOnly: boolean;
  setShowAuctionsOnly: (show: boolean) => void;
  showFeaturedOnly: boolean;
  setShowFeaturedOnly: (show: boolean) => void;
  clearFilters: () => void;
  filteredCount: number;
  isLoading: boolean;
  auctionsCount: number;
  featuredCount: number;
}

const MarketplaceFilterPanel = ({
  searchTerm,
  setSearchTerm,
  selectedRarity,
  setSelectedRarity,
  selectedCondition,
  setSelectedCondition,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  showAuctionsOnly,
  setShowAuctionsOnly,
  showFeaturedOnly,
  setShowFeaturedOnly,
  clearFilters,
  filteredCount,
  isLoading,
  auctionsCount,
  featuredCount,
}: MarketplaceFilterPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      className="glassmorphism mb-8 overflow-hidden"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <SlidersHorizontal size={20} className="text-coin-purple mr-2" />
            <h2 className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-coin-purple to-coin-skyblue">
              Customize Results
            </h2>
          </div>
          
          <button 
            className="md:hidden flex items-center text-coin-purple"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        
        <div className={`${isExpanded ? 'block' : 'hidden'} md:block mt-4`}>
          <MarketplaceFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedRarity={selectedRarity}
            setSelectedRarity={setSelectedRarity}
            selectedCondition={selectedCondition}
            setSelectedCondition={setSelectedCondition}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            sortBy={sortBy}
            setSortBy={setSortBy}
            showAuctionsOnly={showAuctionsOnly}
            setShowAuctionsOnly={setShowAuctionsOnly}
            showFeaturedOnly={showFeaturedOnly}
            setShowFeaturedOnly={setShowFeaturedOnly}
            clearFilters={clearFilters}
            filteredCount={filteredCount}
            isLoading={isLoading}
            auctionsCount={auctionsCount}
            featuredCount={featuredCount}
          />
        </div>
      </div>
      
      <div className="h-1 bg-gradient-to-r from-coin-purple via-coin-orange to-coin-skyblue animate-gradient-shift" style={{ backgroundSize: '200% auto' }}></div>
    </motion.div>
  );
};

export default MarketplaceFilterPanel;
