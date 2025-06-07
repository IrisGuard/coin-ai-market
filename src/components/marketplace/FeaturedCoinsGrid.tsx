
import React from 'react';
import { useCachedMarketplaceData } from '@/hooks/useCachedMarketplaceData';
import OptimizedCoinCard from '@/components/OptimizedCoinCard';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const FeaturedCoinsGrid = () => {
  const { coins, isLoading, error } = useCachedMarketplaceData();

  // Always calculate displayCoins, never conditionally call useMemo
  const displayCoins = React.useMemo(() => {
    if (!coins || coins.length === 0) return [];
    
    return coins
      .filter(coin => coin.authentication_status === 'verified')
      .sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.views || 0) - (a.views || 0);
      })
      .slice(0, 20);
  }, [coins]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-electric-orange" />
          <span className="text-electric-blue">Loading coins...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <Alert className="max-w-md mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Unable to load coins. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  // Show empty state
  if (!displayCoins.length) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No coins available</h3>
        <p className="text-gray-600">Be the first to list a coin!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {displayCoins.map((coin, index) => (
        <div key={coin.id} className="w-full">
          <OptimizedCoinCard coin={coin} index={index} priority={index < 6} />
        </div>
      ))}
    </div>
  );
};

export default FeaturedCoinsGrid;
