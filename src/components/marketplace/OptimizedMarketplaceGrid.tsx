
import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import OptimizedCoinCard from '@/components/OptimizedCoinCard';
import { Coin } from '@/types/coin';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';

interface OptimizedMarketplaceGridProps {
  filteredCoins: Coin[];
  searchTerm: string;
  isAuctionOnly: boolean;
  selectedRarity: string | null;
  clearFilters: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

const OptimizedMarketplaceGrid = memo(({
  filteredCoins,
  searchTerm,
  isAuctionOnly,
  selectedRarity,
  clearFilters,
  isLoading = false,
  error = null,
}: OptimizedMarketplaceGridProps) => {
  const { markStart, markEnd } = usePerformanceMonitoring('OptimizedMarketplaceGrid');

  // Memoize priority coins (first 6 coins for faster loading)
  const { priorityCoins, regularCoins } = useMemo(() => {
    markStart();
    const priority = filteredCoins.slice(0, 6);
    const regular = filteredCoins.slice(6);
    markEnd('coin_prioritization');
    
    return {
      priorityCoins: priority,
      regularCoins: regular
    };
  }, [filteredCoins, markStart, markEnd]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.03 // Reduced stagger for better performance
      }
    }
  };

  // Show error state
  if (error) {
    return (
      <motion.div 
        className="text-center py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Alert className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Unable to load coins. Please try again later.
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }
  
  if (!isLoading && filteredCoins.length === 0) {
    return (
      <motion.div 
        className="text-center py-16 bg-bg-primary rounded-2xl shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-4xl">🔍</div>
          </div>
          <h2 className="text-2xl font-semibold text-text-primary mb-2">No coins found</h2>
          <p className="text-text-secondary mb-6">
            We couldn't find any coins matching your search criteria.
          </p>
          <button 
            className="px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-bg-primary rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
            onClick={clearFilters}
          >
            Clear all filters
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-text-secondary">
            Showing <span className="font-semibold text-text-primary">{filteredCoins.length}</span> coins
          </p>
          {(searchTerm || isAuctionOnly || selectedRarity) && (
            <button 
              className="text-sm text-brand-primary hover:text-brand-primary/80 underline transition-colors mt-1"
              onClick={clearFilters}
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {/* Priority coins load first */}
        {priorityCoins.map((coin, index) => (
          <OptimizedCoinCard 
            key={coin.id} 
            coin={coin} 
            index={index} 
            priority={true}
          />
        ))}
        
        {/* Regular coins load with lazy loading */}
        {regularCoins.map((coin, index) => (
          <OptimizedCoinCard 
            key={coin.id} 
            coin={coin} 
            index={priorityCoins.length + index}
            priority={false}
          />
        ))}
      </motion.div>
    </>
  );
});

OptimizedMarketplaceGrid.displayName = 'OptimizedMarketplaceGrid';

export default OptimizedMarketplaceGrid;
