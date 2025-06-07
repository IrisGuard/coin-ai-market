
import React from 'react';
import { useCoins } from '@/hooks/useCoins';
import EnhancedCoinCard from '@/components/EnhancedCoinCard';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const FeaturedCoinsGrid = () => {
  const { data: coins, isLoading, error } = useCoins();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
          <span className="text-text-secondary">Loading coins...</span>
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

  // Get all verified coins, featured first
  const displayCoins = React.useMemo(() => {
    if (!coins || coins.length === 0) return [];
    
    return coins
      .filter(coin => coin.authentication_status === 'verified')
      .sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.views || 0) - (a.views || 0);
      })
      .slice(0, 20); // Show more coins like Etsy
  }, [coins]);

  // Show empty state
  if (!displayCoins.length) {
    return (
      <div className="text-center py-16 bg-bg-secondary rounded-lg">
        <h3 className="text-xl font-semibold text-text-primary mb-2">No coins available</h3>
        <p className="text-text-secondary">Be the first to list a coin!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {displayCoins.map((coin, index) => (
        <div key={coin.id} className="w-full">
          <EnhancedCoinCard coin={coin} index={index} />
        </div>
      ))}
    </div>
  );
};

export default FeaturedCoinsGrid;
