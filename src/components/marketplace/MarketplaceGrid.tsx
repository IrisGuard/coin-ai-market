
import { motion } from 'framer-motion';
import CoinCard from '@/components/CoinCard';
import { Coin } from '@/types/coin';

interface MarketplaceGridProps {
  filteredCoins: Coin[];
  searchTerm: string;
  isAuctionOnly: boolean;
  selectedRarity: string | null;
  clearFilters: () => void;
}

const MarketplaceGrid = ({
  filteredCoins,
  searchTerm,
  isAuctionOnly,
  selectedRarity,
  clearFilters,
}: MarketplaceGridProps) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };
  
  if (filteredCoins.length === 0) {
    return (
      <motion.div 
        className="text-center py-16 glassmorphism"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-coin-purple mb-2">No coins found</h2>
        <p className="text-gray-600 mb-6">
          We couldn't find any coins matching your search criteria.
        </p>
        <button 
          className="px-6 py-2 bg-gradient-to-r from-coin-purple to-coin-skyblue text-white rounded-full hover:shadow-lg transition-shadow"
          onClick={clearFilters}
        >
          Clear all filters
        </button>
      </motion.div>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-gray-600">Showing <span className="font-semibold text-coin-dark">{filteredCoins.length}</span> coins</p>
        
        {(searchTerm || isAuctionOnly || selectedRarity) && (
          <button 
            className="text-sm text-coin-purple hover:text-coin-darkpurple underline transition-colors"
            onClick={clearFilters}
          >
            Clear filters
          </button>
        )}
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredCoins.map((coin) => (
          <motion.div key={coin.id} variants={itemVariants}>
            <CoinCard coin={coin} />
          </motion.div>
        ))}
      </motion.div>
    </>
  );
};

export default MarketplaceGrid;
