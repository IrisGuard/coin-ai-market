
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OptimizedCoinCard from '@/components/OptimizedCoinCard';
import { Coin } from '@/types/coin';

interface ActiveMarketplaceResultsProps {
  isLoading: boolean;
  filteredCoins: Coin[];
  viewMode: 'grid' | 'list';
  clearFilters: () => void;
}

const ActiveMarketplaceResults: React.FC<ActiveMarketplaceResultsProps> = ({
  isLoading,
  filteredCoins,
  viewMode,
  clearFilters
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-electric-orange" />
          <span className="text-electric-blue">Loading marketplace...</span>
        </div>
      </div>
    );
  }

  if (filteredCoins.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gradient-to-br from-electric-blue to-electric-purple rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-4xl">🔍</div>
          </div>
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-electric-red to-electric-orange bg-clip-text text-transparent mb-2">No coins found</h2>
          <p className="text-electric-blue mb-6">
            We couldn't find any coins matching your search criteria.
          </p>
          <Button onClick={clearFilters} className="bg-gradient-to-r from-electric-orange to-electric-red hover:from-electric-red hover:to-electric-orange text-white">
            Clear all filters
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={viewMode === 'grid' 
      ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      : "space-y-4"
    }>
      {filteredCoins.map((coin, index) => (
        <div key={coin.id} className="w-full">
          <OptimizedCoinCard coin={coin} index={index} priority={index < 10} />
        </div>
      ))}
    </div>
  );
};

export default ActiveMarketplaceResults;
