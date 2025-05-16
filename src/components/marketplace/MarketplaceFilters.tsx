
import { Filter, CheckCircle2, CircleDashed } from 'lucide-react';
import { Rarity } from '@/types/coin';
import { motion } from 'framer-motion';

interface MarketplaceFiltersProps {
  isAuctionOnly: boolean;
  setIsAuctionOnly: (value: boolean) => void;
  selectedRarity: string | null;
  setSelectedRarity: (value: string | null) => void;
}

const MarketplaceFilters = ({
  isAuctionOnly,
  setIsAuctionOnly,
  selectedRarity,
  setSelectedRarity,
}: MarketplaceFiltersProps) => {
  const rarityOptions: Rarity[] = ['Common', 'Uncommon', 'Rare', 'Ultra Rare'];
  
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common':
        return 'bg-green-500';
      case 'Uncommon':
        return 'bg-blue-500';
      case 'Rare':
        return 'bg-purple-500';
      case 'Ultra Rare':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center">
        <Filter size={18} className="text-coin-purple mr-2" />
        <span className="text-gray-700 font-medium">Filters:</span>
      </div>
      
      <motion.button
        className={`flex items-center px-3 py-1.5 rounded-full transition-all ${
          isAuctionOnly 
            ? 'bg-coin-purple text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        onClick={() => setIsAuctionOnly(!isAuctionOnly)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isAuctionOnly ? (
          <CheckCircle2 size={16} className="mr-1.5" />
        ) : (
          <CircleDashed size={16} className="mr-1.5" />
        )}
        <span>Auctions only</span>
      </motion.button>
      
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-gray-600 mr-1">Rarity:</span>
        <div className="flex flex-wrap gap-2">
          <motion.button
            className={`px-3 py-1 rounded-full text-sm border transition-all ${
              selectedRarity === null 
                ? 'bg-coin-purple text-white border-coin-purple' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedRarity(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All
          </motion.button>
          
          {rarityOptions.map((rarity) => (
            <motion.button
              key={rarity}
              className={`px-3 py-1 rounded-full text-sm border transition-all flex items-center ${
                selectedRarity === rarity 
                  ? 'bg-white text-gray-800 border-gray-300 font-medium' 
                  : 'bg-white/70 text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedRarity(rarity)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={`w-2 h-2 rounded-full ${getRarityColor(rarity)} mr-1.5`}></span>
              {rarity}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceFilters;
