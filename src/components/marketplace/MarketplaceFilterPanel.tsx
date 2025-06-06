
import { useState } from 'react';
import { motion } from 'framer-motion';
import MarketplaceFilters from './MarketplaceFilters';
import MarketplaceSorting from './MarketplaceSorting';
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';

interface MarketplaceFilterPanelProps {
  showAuctionsOnly: boolean;
  setShowAuctionsOnly: (value: boolean) => void;
  selectedRarity: string | null;
  setSelectedRarity: (value: string | null) => void;
  sortBy: 'price' | 'year';
  sortDirection: 'asc' | 'desc';
  handleSort: (field: 'price' | 'year') => void;
}

const MarketplaceFilterPanel = ({
  showAuctionsOnly,
  setShowAuctionsOnly,
  selectedRarity,
  setSelectedRarity,
  sortBy,
  sortDirection,
  handleSort,
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
          <div className="flex flex-col md:flex-row flex-wrap items-start md:items-center justify-between gap-4">
            <MarketplaceFilters
              showAuctionsOnly={showAuctionsOnly}
              setShowAuctionsOnly={setShowAuctionsOnly}
              selectedRarity={selectedRarity}
              setSelectedRarity={setSelectedRarity}
            />
            <MarketplaceSorting
              sortBy={sortBy}
              sortDirection={sortDirection}
              handleSort={handleSort}
            />
          </div>
        </div>
      </div>
      
      <div className="h-1 bg-gradient-to-r from-coin-purple via-coin-orange to-coin-skyblue animate-gradient-shift" style={{ backgroundSize: '200% auto' }}></div>
    </motion.div>
  );
};

export default MarketplaceFilterPanel;
