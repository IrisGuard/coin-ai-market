
import React from 'react';
import { useCachedMarketplaceData } from '@/hooks/useCachedMarketplaceData';
import OptimizedCoinCard from '@/components/OptimizedCoinCard';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validateComponentProps, initializeProductionMonitor } from '@/utils/mockDataBlocker';

const FeaturedCoinsGrid = () => {
  // Initialize production monitoring
  React.useEffect(() => {
    initializeProductionMonitor();
  }, []);

  const { coins, isLoading, error } = useCachedMarketplaceData();

  const displayCoins = React.useMemo(() => {
    if (!coins || coins.length === 0) return [];
    
    const filteredCoins = coins
      .filter(coin => 
        coin.authentication_status === 'verified' || 
        coin.category === 'error_coin'
      )
      .sort((a, b) => {
        if (a.category === 'error_coin' && b.category !== 'error_coin') return -1;
        if (a.category !== 'error_coin' && b.category === 'error_coin') return 1;
        
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        
        return (b.views || 0) - (a.views || 0);
      })
      .slice(0, 24);

    // Validate no mock data in coins
    filteredCoins.forEach((coin, index) => {
      validateComponentProps(coin, `FeaturedCoinsGrid coin ${index}`);
    });

    return filteredCoins;
  }, [coins]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-primary">Loading featured coins...</span>
        </div>
      </div>
    );
  }

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

  if (!displayCoins.length) {
    return (
      <div className="text-center py-16 bg-muted/20 rounded-lg">
        <h3 className="text-xl font-semibold text-foreground mb-2">No coins available for sale</h3>
        <p className="text-muted-foreground">Check back later for new listings!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {displayCoins.map((coin, index) => (
          <div key={coin.id} className="w-full">
            <OptimizedCoinCard 
              coin={coin} 
              index={index} 
              priority={index < 6 || coin.category === 'error_coin'} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCoinsGrid;
